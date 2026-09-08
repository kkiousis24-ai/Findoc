using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Findoc.Api.Data;
using Findoc.Api.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);


// ======================================================
// DATABASE
// ======================================================

builder.Services.AddDbContext<FindocDbContext>(options =>
    options.UseSqlite(
        builder.Configuration.GetConnectionString(
            "DefaultConnection")));


// ======================================================
// PASSWORD HASHING
// ======================================================

builder.Services.AddScoped<
    IPasswordHasher<ApplicationUser>,
    PasswordHasher<ApplicationUser>>();


// ======================================================
// JWT AUTHENTICATION
// ======================================================

var jwtKey =
    builder.Configuration["Jwt:Key"]
    ?? throw new InvalidOperationException(
        "JWT Key is missing.");

var jwtIssuer =
    builder.Configuration["Jwt:Issuer"]
    ?? throw new InvalidOperationException(
        "JWT Issuer is missing.");

var jwtAudience =
    builder.Configuration["Jwt:Audience"]
    ?? throw new InvalidOperationException(
        "JWT Audience is missing.");

builder.Services
    .AddAuthentication(
        JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters =
            new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,

                ValidIssuer = jwtIssuer,
                ValidAudience = jwtAudience,

                IssuerSigningKey =
                    new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(jwtKey)),

                ClockSkew = TimeSpan.Zero
            };
    });

builder.Services.AddAuthorization();


// ======================================================
// CORS
// ======================================================

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy
            .SetIsOriginAllowed(origin =>
            {
                if (!Uri.TryCreate(
                        origin,
                        UriKind.Absolute,
                        out var uri))
                {
                    return false;
                }

                return uri.Host.Equals(
                           "localhost",
                           StringComparison.OrdinalIgnoreCase)
                       ||
                       uri.Host.Equals(
                           "127.0.0.1",
                           StringComparison.OrdinalIgnoreCase);
            })
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});


var app = builder.Build();

app.UseCors("Frontend");

app.UseAuthentication();
app.UseAuthorization();


// ======================================================
// HELPER FUNCTIONS
// ======================================================

string CreateJwtToken(
    ApplicationUser user)
{
    var claims = new List<Claim>
    {
        new(
            JwtRegisteredClaimNames.Sub,
            user.Id.ToString()),

        new(
            ClaimTypes.NameIdentifier,
            user.Id.ToString()),

        new(
            ClaimTypes.Name,
            user.FullName),

        new(
            ClaimTypes.Email,
            user.Email),

        new(
            JwtRegisteredClaimNames.Email,
            user.Email),

        new(
            JwtRegisteredClaimNames.Jti,
            Guid.NewGuid().ToString())
    };

    var key =
        new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(jwtKey));

    var credentials =
        new SigningCredentials(
            key,
            SecurityAlgorithms.HmacSha256);

    var expiresAt =
        DateTime.UtcNow.AddHours(24);

    var token =
        new JwtSecurityToken(
            issuer: jwtIssuer,
            audience: jwtAudience,
            claims: claims,
            expires: expiresAt,
            signingCredentials: credentials);

    return new JwtSecurityTokenHandler()
        .WriteToken(token);
}


int? GetAuthenticatedUserId(
    ClaimsPrincipal principal)
{
    var claim =
        principal.FindFirst(
            ClaimTypes.NameIdentifier);

    if (claim is null)
    {
        return null;
    }

    if (!int.TryParse(
            claim.Value,
            out var userId))
    {
        return null;
    }

    return userId;
}


// ======================================================
// HOME
// ======================================================

app.MapGet("/", () =>
{
    return Results.Ok(new
    {
        message = "Welcome to Findoc API"
    });
});


// ======================================================
// HEALTH
// ======================================================

app.MapGet("/api/health", () =>
{
    return Results.Ok(new
    {
        status = "healthy",
        application = "Findoc API"
    });
});


// ======================================================
// AUTH
// ======================================================


// ------------------------------------------------------
// REGISTER
// ------------------------------------------------------

app.MapPost(
    "/api/auth/register",
    async (
        RegisterRequest request,
        FindocDbContext db,
        IPasswordHasher<ApplicationUser>
            passwordHasher) =>
    {
        var fullName =
            request.FullName.Trim();

        var email =
            request.Email
                .Trim()
                .ToLowerInvariant();

        if (string.IsNullOrWhiteSpace(fullName))
        {
            return Results.BadRequest(
                new
                {
                    message =
                        "Full name is required"
                });
        }

        if (string.IsNullOrWhiteSpace(email))
        {
            return Results.BadRequest(
                new
                {
                    message =
                        "Email is required"
                });
        }

        if (!email.Contains('@'))
        {
            return Results.BadRequest(
                new
                {
                    message =
                        "Invalid email address"
                });
        }

        if (string.IsNullOrWhiteSpace(
                request.Password))
        {
            return Results.BadRequest(
                new
                {
                    message =
                        "Password is required"
                });
        }

        if (request.Password.Length < 8)
        {
            return Results.BadRequest(
                new
                {
                    message =
                        "Password must contain at least 8 characters"
                });
        }

        var emailExists =
            await db.Users.AnyAsync(
                u => u.Email == email);

        if (emailExists)
        {
            return Results.Conflict(
                new
                {
                    message =
                        "An account with this email already exists"
                });
        }

        var user =
            new ApplicationUser
            {
                FullName = fullName,
                Email = email,
                CreatedAtUtc =
                    DateTime.UtcNow
            };

        user.PasswordHash =
            passwordHasher.HashPassword(
                user,
                request.Password);

        db.Users.Add(user);

        try
        {
            await db.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            return Results.Conflict(
                new
                {
                    message =
                        "An account with this email already exists"
                });
        }

        var token =
            CreateJwtToken(user);

        return Results.Ok(
            new
            {
                token,

                expiresIn = 86400,

                user = new
                {
                    user.Id,
                    user.FullName,
                    user.Email
                }
            });
    });


// ------------------------------------------------------
// LOGIN
// ------------------------------------------------------

app.MapPost(
    "/api/auth/login",
    async (
        LoginRequest request,
        FindocDbContext db,
        IPasswordHasher<ApplicationUser>
            passwordHasher) =>
    {
        var email =
            request.Email
                .Trim()
                .ToLowerInvariant();

        var user =
            await db.Users
                .FirstOrDefaultAsync(
                    u => u.Email == email);

        if (user is null)
        {
            return Results.Unauthorized();
        }

        var verificationResult =
            passwordHasher.VerifyHashedPassword(
                user,
                user.PasswordHash,
                request.Password);

        if (verificationResult ==
            PasswordVerificationResult.Failed)
        {
            return Results.Unauthorized();
        }

        if (verificationResult ==
            PasswordVerificationResult.SuccessRehashNeeded)
        {
            user.PasswordHash =
                passwordHasher.HashPassword(
                    user,
                    request.Password);

            await db.SaveChangesAsync();
        }

        var token =
            CreateJwtToken(user);

        return Results.Ok(
            new
            {
                token,

                expiresIn = 86400,

                user = new
                {
                    user.Id,
                    user.FullName,
                    user.Email
                }
            });
    });


// ------------------------------------------------------
// CURRENT USER
// ------------------------------------------------------

app.MapGet(
        "/api/auth/me",
        async (
            HttpContext httpContext,
            FindocDbContext db) =>
        {
            var userId =
                GetAuthenticatedUserId(
                    httpContext.User);

            if (userId is null)
            {
                return Results.Unauthorized();
            }

            var user =
                await db.Users
                    .AsNoTracking()
                    .FirstOrDefaultAsync(
                        u =>
                            u.Id ==
                            userId.Value);

            if (user is null)
            {
                return Results.Unauthorized();
            }

            return Results.Ok(
                new
                {
                    user.Id,
                    user.FullName,
                    user.Email,
                    user.CreatedAtUtc
                });
        })
    .RequireAuthorization();


// ======================================================
// DOCTORS
// ======================================================


// ------------------------------------------------------
// GET ALL DOCTORS
// ------------------------------------------------------

app.MapGet(
    "/api/doctors",
    async (
        string? specialty,
        string? city,
        FindocDbContext db) =>
    {
        var query =
            db.Doctors
                .AsNoTracking()
                .AsQueryable();

        if (!string.IsNullOrWhiteSpace(
                specialty))
        {
            query =
                query.Where(
                    d =>
                        EF.Functions.Like(
                            d.Specialty,
                            $"%{specialty.Trim()}%"));
        }

        if (!string.IsNullOrWhiteSpace(
                city))
        {
            query =
                query.Where(
                    d =>
                        EF.Functions.Like(
                            d.City,
                            $"%{city.Trim()}%"));
        }

        var doctors =
            await query
                .OrderByDescending(
                    d => d.Rating)
                .ToListAsync();

        return Results.Ok(doctors);
    });


// ------------------------------------------------------
// GET DOCTOR BY ID
// ------------------------------------------------------

app.MapGet(
    "/api/doctors/{id:int}",
    async (
        int id,
        FindocDbContext db) =>
    {
        var doctor =
            await db.Doctors
                .AsNoTracking()
                .FirstOrDefaultAsync(
                    d => d.Id == id);

        if (doctor is null)
        {
            return Results.NotFound(
                new
                {
                    message =
                        "Doctor not found"
                });
        }

        return Results.Ok(doctor);
    });


// ------------------------------------------------------
// CREATE DOCTOR
// ------------------------------------------------------

app.MapPost(
    "/api/doctors",
    async (
        Doctor doctor,
        FindocDbContext db) =>
    {
        db.Doctors.Add(doctor);

        await db.SaveChangesAsync();

        return Results.Created(
            $"/api/doctors/{doctor.Id}",
            doctor);
    });


// ------------------------------------------------------
// DELETE DOCTOR
// ------------------------------------------------------

app.MapDelete(
    "/api/doctors/{id:int}",
    async (
        int id,
        FindocDbContext db) =>
    {
        var doctor =
            await db.Doctors.FindAsync(id);

        if (doctor is null)
        {
            return Results.NotFound(
                new
                {
                    message =
                        "Doctor not found"
                });
        }

        db.Doctors.Remove(doctor);

        await db.SaveChangesAsync();

        return Results.NoContent();
    });


// ======================================================
// SPECIALTIES
// ======================================================

app.MapGet(
    "/api/specialties",
    async (
        FindocDbContext db) =>
    {
        var specialties =
            await db.Doctors
                .AsNoTracking()
                .Select(
                    d => d.Specialty)
                .Distinct()
                .OrderBy(
                    s => s)
                .ToListAsync();

        return Results.Ok(
            specialties);
    });


// ======================================================
// AVAILABILITY
// ======================================================

app.MapGet(
    "/api/doctors/{id:int}/availability",
    async (
        int id,
        string date,
        FindocDbContext db) =>
    {
        var doctorExists =
            await db.Doctors.AnyAsync(
                d => d.Id == id);

        if (!doctorExists)
        {
            return Results.NotFound(
                new
                {
                    message =
                        "Doctor not found"
                });
        }

        if (!DateOnly.TryParseExact(
                date,
                "yyyy-MM-dd",
                CultureInfo.InvariantCulture,
                DateTimeStyles.None,
                out var selectedDate))
        {
            return Results.BadRequest(
                new
                {
                    message =
                        "Date must use yyyy-MM-dd format"
                });
        }

        var today =
            DateOnly.FromDateTime(
                DateTime.Now);

        if (selectedDate < today)
        {
            return Results.BadRequest(
                new
                {
                    message =
                        "Past dates are not available"
                });
        }

        if (selectedDate.DayOfWeek
            is DayOfWeek.Saturday
            or DayOfWeek.Sunday)
        {
            return Results.Ok(
                Array.Empty<object>());
        }

        var dayStart =
            selectedDate.ToDateTime(
                new TimeOnly(0, 0));

        var dayEnd =
            dayStart.AddDays(1);

        var bookedTimes =
            await db.Appointments
                .AsNoTracking()
                .Where(
                    a =>
                        a.DoctorId == id &&
                        a.Status !=
                        "Cancelled" &&
                        a.StartsAt >=
                        dayStart &&
                        a.StartsAt <
                        dayEnd)
                .Select(
                    a => a.StartsAt)
                .ToListAsync();

        var slots =
            new List<object>();

        var current =
            selectedDate.ToDateTime(
                new TimeOnly(9, 0));

        var closingTime =
            selectedDate.ToDateTime(
                new TimeOnly(17, 0));

        while (current < closingTime)
        {
            if (!bookedTimes.Contains(
                    current))
            {
                slots.Add(
                    new
                    {
                        startsAt =
                            current,

                        time =
                            current.ToString(
                                "HH:mm")
                    });
            }

            current =
                current.AddMinutes(30);
        }

        return Results.Ok(slots);
    });


// ======================================================
// APPOINTMENTS
// ======================================================


// ------------------------------------------------------
// CREATE APPOINTMENT
// ------------------------------------------------------

app.MapPost(
    "/api/appointments",
    async (
        CreateAppointmentRequest request,
        HttpContext httpContext,
        FindocDbContext db) =>
    {
        if (string.IsNullOrWhiteSpace(
                request.PatientName))
        {
            return Results.BadRequest(
                new
                {
                    message =
                        "Patient name is required"
                });
        }

        if (string.IsNullOrWhiteSpace(
                request.PatientEmail))
        {
            return Results.BadRequest(
                new
                {
                    message =
                        "Patient email is required"
                });
        }

        var doctor =
            await db.Doctors.FindAsync(
                request.DoctorId);

        if (doctor is null)
        {
            return Results.NotFound(
                new
                {
                    message =
                        "Doctor not found"
                });
        }

        if (request.StartsAt <=
            DateTime.Now)
        {
            return Results.BadRequest(
                new
                {
                    message =
                        "Appointment cannot be in the past"
                });
        }

        if (request.StartsAt.DayOfWeek
            is DayOfWeek.Saturday
            or DayOfWeek.Sunday)
        {
            return Results.BadRequest(
                new
                {
                    message =
                        "Appointments are not available on weekends"
                });
        }

        var openingTime =
            new TimeSpan(
                9,
                0,
                0);

        var closingTime =
            new TimeSpan(
                17,
                0,
                0);

        if (request.StartsAt.TimeOfDay <
                openingTime ||
            request.StartsAt.TimeOfDay >=
                closingTime)
        {
            return Results.BadRequest(
                new
                {
                    message =
                        "Appointment time must be between 09:00 and 17:00"
                });
        }

        if (request.StartsAt.Second != 0 ||
            request.StartsAt.Millisecond != 0 ||
            request.StartsAt.Minute
            is not 0 and not 30)
        {
            return Results.BadRequest(
                new
                {
                    message =
                        "Appointments must start on a 30-minute slot"
                });
        }

        int? authenticatedUserId =
            null;

        if (httpContext.User.Identity
            ?.IsAuthenticated == true)
        {
            authenticatedUserId =
                GetAuthenticatedUserId(
                    httpContext.User);
        }

        var existingAppointment =
            await db.Appointments
                .FirstOrDefaultAsync(
                    a =>
                        a.DoctorId ==
                        request.DoctorId &&
                        a.StartsAt ==
                        request.StartsAt);

        if (existingAppointment is not null)
        {
            if (existingAppointment.Status !=
                "Cancelled")
            {
                return Results.Conflict(
                    new
                    {
                        message =
                            "This appointment slot is no longer available"
                    });
            }

            existingAppointment.UserId =
                authenticatedUserId;

            existingAppointment.PatientName =
                request.PatientName.Trim();

            existingAppointment.PatientEmail =
                request.PatientEmail
                    .Trim()
                    .ToLowerInvariant();

            existingAppointment.Status =
                "Confirmed";

            existingAppointment.CreatedAtUtc =
                DateTime.UtcNow;

            await db.SaveChangesAsync();

            return Results.Ok(
                new
                {
                    existingAppointment.Id,

                    existingAppointment.DoctorId,

                    existingAppointment.UserId,

                    doctorName =
                        $"{doctor.FirstName} {doctor.LastName}",

                    existingAppointment.PatientName,

                    existingAppointment.PatientEmail,

                    existingAppointment.StartsAt,

                    existingAppointment.Status,

                    existingAppointment.CreatedAtUtc
                });
        }

        var appointment =
            new Appointment
            {
                DoctorId =
                    request.DoctorId,

                UserId =
                    authenticatedUserId,

                PatientName =
                    request.PatientName.Trim(),

                PatientEmail =
                    request.PatientEmail
                        .Trim()
                        .ToLowerInvariant(),

                StartsAt =
                    request.StartsAt,

                Status =
                    "Confirmed",

                CreatedAtUtc =
                    DateTime.UtcNow
            };

        db.Appointments.Add(
            appointment);

        try
        {
            await db.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            return Results.Conflict(
                new
                {
                    message =
                        "This appointment slot is no longer available"
                });
        }

        return Results.Created(
            $"/api/appointments/{appointment.Id}",
            new
            {
                appointment.Id,

                appointment.DoctorId,

                appointment.UserId,

                doctorName =
                    $"{doctor.FirstName} {doctor.LastName}",

                appointment.PatientName,

                appointment.PatientEmail,

                appointment.StartsAt,

                appointment.Status,

                appointment.CreatedAtUtc
            });
    });


// ------------------------------------------------------
// GET MY APPOINTMENTS
// ------------------------------------------------------

app.MapGet(
        "/api/appointments/my",
        async (
            HttpContext httpContext,
            FindocDbContext db) =>
        {
            var userId =
                GetAuthenticatedUserId(
                    httpContext.User);

            if (userId is null)
            {
                return Results.Unauthorized();
            }

            var appointments =
                await db.Appointments
                    .AsNoTracking()
                    .Include(
                        a => a.Doctor)
                    .Where(
                        a =>
                            a.UserId ==
                            userId.Value)
                    .OrderBy(
                        a => a.StartsAt)
                    .Select(
                        a => new
                        {
                            a.Id,

                            a.StartsAt,

                            a.Status,

                            a.PatientName,

                            a.PatientEmail,

                            doctor = new
                            {
                                a.Doctor.Id,

                                a.Doctor.FirstName,

                                a.Doctor.LastName,

                                a.Doctor.Specialty,

                                a.Doctor.City,

                                a.Doctor.Address,

                                a.Doctor
                                    .ConsultationPrice,

                                a.Doctor.Rating
                            }
                        })
                    .ToListAsync();

            return Results.Ok(
                appointments);
        })
    .RequireAuthorization();


// ------------------------------------------------------
// GET APPOINTMENT BY ID
// ------------------------------------------------------

app.MapGet(
        "/api/appointments/{id:int}",
        async (
            int id,
            HttpContext httpContext,
            FindocDbContext db) =>
        {
            var userId =
                GetAuthenticatedUserId(
                    httpContext.User);

            if (userId is null)
            {
                return Results.Unauthorized();
            }

            var appointment =
                await db.Appointments
                    .AsNoTracking()
                    .Include(
                        a => a.Doctor)
                    .FirstOrDefaultAsync(
                        a => a.Id == id);

            if (appointment is null)
            {
                return Results.NotFound(
                    new
                    {
                        message =
                            "Appointment not found"
                    });
            }

            if (appointment.UserId !=
                userId.Value)
            {
                return Results.Forbid();
            }

            return Results.Ok(
                new
                {
                    appointment.Id,

                    appointment.UserId,

                    appointment.PatientName,

                    appointment.PatientEmail,

                    appointment.StartsAt,

                    appointment.Status,

                    appointment.CreatedAtUtc,

                    doctor = new
                    {
                        appointment.Doctor.Id,

                        appointment.Doctor.FirstName,

                        appointment.Doctor.LastName,

                        appointment.Doctor.Specialty,

                        appointment.Doctor.City,

                        appointment.Doctor.Address,

                        appointment.Doctor
                            .ConsultationPrice,

                        appointment.Doctor.Rating
                    }
                });
        })
    .RequireAuthorization();


// ------------------------------------------------------
// CANCEL MY APPOINTMENT
// ------------------------------------------------------

app.MapPatch(
        "/api/appointments/{id:int}/cancel",
        async (
            int id,
            HttpContext httpContext,
            FindocDbContext db) =>
        {
            var userId =
                GetAuthenticatedUserId(
                    httpContext.User);

            if (userId is null)
            {
                return Results.Unauthorized();
            }

            var appointment =
                await db.Appointments
                    .FirstOrDefaultAsync(
                        a => a.Id == id);

            if (appointment is null)
            {
                return Results.NotFound(
                    new
                    {
                        message =
                            "Appointment not found"
                    });
            }

            if (appointment.UserId !=
                userId.Value)
            {
                return Results.Forbid();
            }

            if (appointment.Status ==
                "Cancelled")
            {
                return Results.BadRequest(
                    new
                    {
                        message =
                            "Appointment is already cancelled"
                    });
            }

            if (appointment.StartsAt <=
                DateTime.Now)
            {
                return Results.BadRequest(
                    new
                    {
                        message =
                            "Past appointments cannot be cancelled"
                    });
            }

            appointment.Status =
                "Cancelled";

            await db.SaveChangesAsync();

            return Results.Ok(
                new
                {
                    appointment.Id,

                    appointment.Status,

                    message =
                        "Appointment cancelled successfully"
                });
        })
    .RequireAuthorization();


app.Run();


// ======================================================
// REQUEST MODELS
// ======================================================

record RegisterRequest(
    string FullName,
    string Email,
    string Password);


record LoginRequest(
    string Email,
    string Password);


record CreateAppointmentRequest(
    int DoctorId,
    string PatientName,
    string PatientEmail,
    DateTime StartsAt);