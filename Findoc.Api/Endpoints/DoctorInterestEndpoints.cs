using Findoc.Api.Data;
using Findoc.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Findoc.Api.Endpoints;

public static class DoctorInterestEndpoints
{
    public static IEndpointRouteBuilder MapDoctorInterestEndpoints(
        this IEndpointRouteBuilder app)
    {
        app.MapPost(
            "/api/doctor-interests",
            async (
                DoctorInterestRequest request,
                FindocDbContext db) =>
            {
                var fullName =
                    request.FullName.Trim();

                var specialty =
                    request.Specialty.Trim();

                var city =
                    request.City.Trim();

                var area =
                    request.Area?.Trim()
                    ?? string.Empty;

                var email =
                    request.Email
                        .Trim()
                        .ToLowerInvariant();

                var phone =
                    request.Phone.Trim();

                var message =
                    request.Message?.Trim()
                    ?? string.Empty;


                if (string.IsNullOrWhiteSpace(
                        fullName))
                {
                    return Results.BadRequest(
                        new
                        {
                            message =
                                "Full name is required."
                        });
                }


                if (string.IsNullOrWhiteSpace(
                        specialty))
                {
                    return Results.BadRequest(
                        new
                        {
                            message =
                                "Specialty is required."
                        });
                }


                if (string.IsNullOrWhiteSpace(
                        city))
                {
                    return Results.BadRequest(
                        new
                        {
                            message =
                                "City is required."
                        });
                }


                if (string.IsNullOrWhiteSpace(
                        email))
                {
                    return Results.BadRequest(
                        new
                        {
                            message =
                                "Email is required."
                        });
                }


                if (!email.Contains('@'))
                {
                    return Results.BadRequest(
                        new
                        {
                            message =
                                "Invalid email address."
                        });
                }


                if (string.IsNullOrWhiteSpace(
                        phone))
                {
                    return Results.BadRequest(
                        new
                        {
                            message =
                                "Phone is required."
                        });
                }


                if (!request.ConsentToContact)
                {
                    return Results.BadRequest(
                        new
                        {
                            message =
                                "Consent to contact is required."
                        });
                }


                var duplicateExists =
                    await db.DoctorInterests
                        .AnyAsync(
                            interest =>
                                interest.Email ==
                                email &&
                                interest.Status ==
                                "New");


                if (duplicateExists)
                {
                    return Results.Conflict(
                        new
                        {
                            message =
                                "An active interest request already exists for this email."
                        });
                }


                var doctorInterest =
                    new DoctorInterest
                    {
                        FullName =
                            fullName,

                        Specialty =
                            specialty,

                        City =
                            city,

                        Area =
                            area,

                        Email =
                            email,

                        Phone =
                            phone,

                        Message =
                            message,

                        ConsentToContact =
                            true,

                        Status =
                            "New",

                        CreatedAtUtc =
                            DateTime.UtcNow
                    };


                db.DoctorInterests.Add(
                    doctorInterest);


                await db.SaveChangesAsync();


                return Results.Created(
                    $"/api/doctor-interests/{doctorInterest.Id}",
                    new
                    {
                        doctorInterest.Id,

                        doctorInterest.FullName,

                        doctorInterest.Specialty,

                        doctorInterest.City,

                        doctorInterest.Area,

                        doctorInterest.Email,

                        doctorInterest.Phone,

                        doctorInterest.Status,

                        doctorInterest.CreatedAtUtc,

                        message =
                            "Interest request submitted successfully."
                    });
            });


        return app;
    }


    private sealed record DoctorInterestRequest(
        string FullName,
        string Specialty,
        string City,
        string? Area,
        string Email,
        string Phone,
        string? Message,
        bool ConsentToContact);
}