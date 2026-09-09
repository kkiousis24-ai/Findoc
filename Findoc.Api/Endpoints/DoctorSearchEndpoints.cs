using Findoc.Api.Data;
using Findoc.Api.Services;
using Microsoft.EntityFrameworkCore;

namespace Findoc.Api.Endpoints;

public static class DoctorSearchEndpoints
{
    public static void MapDoctorSearchEndpoints(
        this WebApplication app)
    {
        app.MapGet(
            "/api/doctors/smart-search",
            async (
                string query,
                FindocDbContext db) =>
            {
                if (string.IsNullOrWhiteSpace(query))
                {
                    return Results.BadRequest(new
                    {
                        message =
                            "Search query is required"
                    });
                }

                var filters =
                    DoctorSearchParser.Parse(query);

                var doctorsQuery =
                    db.Doctors
                        .AsNoTracking()
                        .Where(
                            doctor =>
                                doctor.IsActive)
                        .AsQueryable();

                // ==========================================
                // SPECIALTY
                // ==========================================

                if (!string.IsNullOrWhiteSpace(
                        filters.Specialty))
                {
                    var value =
                        filters.Specialty
                            .ToLower();

                    doctorsQuery =
                        doctorsQuery.Where(
                            doctor =>
                                doctor.Specialty
                                    .ToLower()
                                    .Contains(value) ||
                                doctor.Subspecialty
                                    .ToLower()
                                    .Contains(value));
                }

                // ==========================================
                // CITY
                // ==========================================

                if (!string.IsNullOrWhiteSpace(
                        filters.City))
                {
                    var value =
                        filters.City
                            .ToLower();

                    doctorsQuery =
                        doctorsQuery.Where(
                            doctor =>
                                doctor.City
                                    .ToLower()
                                    .Contains(value));
                }

                // ==========================================
                // AREA
                // ==========================================

                if (!string.IsNullOrWhiteSpace(
                        filters.Area))
                {
                    var value =
                        filters.Area
                            .ToLower();

                    doctorsQuery =
                        doctorsQuery.Where(
                            doctor =>
                                doctor.Area
                                    .ToLower()
                                    .Contains(value));
                }

                // ==========================================
                // MAX PRICE
                // ==========================================

                if (filters.MaxPrice.HasValue)
                {
                    doctorsQuery =
                        doctorsQuery.Where(
                            doctor =>
                                doctor.ConsultationPrice <=
                                filters.MaxPrice.Value);
                }

                // ==========================================
                // MIN RATING
                // ==========================================

                if (filters.MinRating.HasValue)
                {
                    doctorsQuery =
                        doctorsQuery.Where(
                            doctor =>
                                doctor.Rating >=
                                filters.MinRating.Value);
                }

                // ==========================================
                // INSURANCE
                // ==========================================

                if (filters.AcceptsInsurance.HasValue)
                {
                    doctorsQuery =
                        doctorsQuery.Where(
                            doctor =>
                                doctor.AcceptsInsurance ==
                                filters.AcceptsInsurance.Value);
                }

                if (!string.IsNullOrWhiteSpace(
                        filters.Insurance))
                {
                    var value =
                        filters.Insurance
                            .ToLower();

                    doctorsQuery =
                        doctorsQuery.Where(
                            doctor =>
                                doctor.InsuranceProviders
                                    .ToLower()
                                    .Contains(value));
                }

                // ==========================================
                // ONLINE CONSULTATION
                // ==========================================

                if (filters.Online.HasValue)
                {
                    doctorsQuery =
                        doctorsQuery.Where(
                            doctor =>
                                doctor
                                    .OffersOnlineConsultation ==
                                filters.Online.Value);
                }

                // ==========================================
                // LANGUAGE
                // ==========================================

                if (!string.IsNullOrWhiteSpace(
                        filters.Language))
                {
                    var value =
                        filters.Language
                            .ToLower();

                    doctorsQuery =
                        doctorsQuery.Where(
                            doctor =>
                                doctor.Languages
                                    .ToLower()
                                    .Contains(value));
                }

                // ==========================================
                // VERIFIED
                // ==========================================

                if (filters.Verified.HasValue)
                {
                    doctorsQuery =
                        doctorsQuery.Where(
                            doctor =>
                                doctor.IsVerified ==
                                filters.Verified.Value);
                }

                // ==========================================
                // SORTING
                // ==========================================

                doctorsQuery =
                    filters.Sort switch
                    {
                        "price_asc" =>
                            doctorsQuery
                                .OrderBy(
                                    doctor =>
                                        doctor
                                            .ConsultationPrice),

                        "price_desc" =>
                            doctorsQuery
                                .OrderByDescending(
                                    doctor =>
                                        doctor
                                            .ConsultationPrice),

                        "experience" =>
                            doctorsQuery
                                .OrderByDescending(
                                    doctor =>
                                        doctor
                                            .YearsOfExperience),

                        "reviews" =>
                            doctorsQuery
                                .OrderByDescending(
                                    doctor =>
                                        doctor
                                            .ReviewCount),

                        _ =>
                            doctorsQuery
                                .OrderByDescending(
                                    doctor =>
                                        doctor.Rating)
                                .ThenByDescending(
                                    doctor =>
                                        doctor.ReviewCount)
                    };

                var doctors =
                    await doctorsQuery
                        .ToListAsync();

                return Results.Ok(new
                {
                    originalQuery = query,

                    interpreted = new
                    {
                        filters.Specialty,
                        filters.City,
                        filters.Area,
                        filters.MaxPrice,
                        filters.MinRating,
                        filters.AcceptsInsurance,
                        filters.Insurance,
                        filters.Online,
                        filters.Language,
                        filters.Verified,
                        filters.Sort
                    },

                    resultCount =
                        doctors.Count,

                    doctors
                });
            });
    }
}