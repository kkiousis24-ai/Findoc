using Findoc.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Findoc.Api.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(FindocDbContext db)
    {
        var doctors = new List<Doctor>
        {
            new()
            {
                FirstName = "Maria",
                LastName = "Papadopoulou",
                Specialty = "Cardiologist",
                Subspecialty = "Preventive Cardiology",
                City = "Athens",
                Area = "Ampelokipoi",
                Address = "Leoforos Kifisias 100",
                Bio = "Experienced cardiologist with a focus on preventive cardiology, hypertension and cardiovascular health.",
                Phone = "+30 210 000 0001",
                Email = "maria.papadopoulou@example.com",
                Website = "",
                ConsultationPrice = 50,
                YearsOfExperience = 12,
                Rating = 4.9,
                ReviewCount = 128,
                ImageUrl = "",
                AcceptsInsurance = true,
                InsuranceProviders = "EOPYY, Interamerican",
                OffersOnlineConsultation = true,
                IsVerified = true,
                IsActive = true,
                Latitude = 37.9875,
                Longitude = 23.7570,
                Languages = "Greek, English"
            },

            new()
            {
                FirstName = "Γιώργος",
                LastName = "Νικολαΐδης",
                Specialty = "Cardiologist",
                Subspecialty = "Cardiac Imaging",
                City = "Thessaloniki",
                Area = "City Center",
                Address = "Τσιμισκή 85",
                Bio = "Cardiologist specializing in cardiovascular prevention, hypertension management and routine cardiac assessment.",
                Phone = "+30 2310 000 002",
                Email = "giorgos.nikolaidis@example.com",
                Website = "",
                ConsultationPrice = 55,
                YearsOfExperience = 15,
                Rating = 4.8,
                ReviewCount = 96,
                ImageUrl = "",
                AcceptsInsurance = true,
                InsuranceProviders = "EOPYY, Generali",
                OffersOnlineConsultation = false,
                IsVerified = true,
                IsActive = true,
                Latitude = 40.6320,
                Longitude = 22.9444,
                Languages = "Greek, English"
            },

            new()
            {
                FirstName = "Ελένη",
                LastName = "Μάρκου",
                Specialty = "Dermatologist",
                Subspecialty = "Clinical Dermatology",
                City = "Athens",
                Area = "Kolonaki",
                Address = "Βασιλίσσης Σοφίας 112",
                Bio = "Dermatologist focused on clinical dermatology, skin health, acne treatment and preventive dermatological care.",
                Phone = "+30 210 000 0003",
                Email = "eleni.markou@example.com",
                Website = "",
                ConsultationPrice = 60,
                YearsOfExperience = 10,
                Rating = 4.9,
                ReviewCount = 152,
                ImageUrl = "",
                AcceptsInsurance = false,
                InsuranceProviders = "",
                OffersOnlineConsultation = true,
                IsVerified = true,
                IsActive = true,
                Latitude = 37.9760,
                Longitude = 23.7450,
                Languages = "Greek, English, French"
            },

            new()
            {
                FirstName = "Δημήτρης",
                LastName = "Βρεττός",
                Specialty = "Neurologist",
                Subspecialty = "Headache Disorders",
                City = "Ioannina",
                Area = "Center",
                Address = "Δωδώνης 42",
                Bio = "Neurologist with experience in headache disorders, neurological assessment and long-term patient monitoring.",
                Phone = "+30 2651 000 004",
                Email = "dimitris.vrettos@example.com",
                Website = "",
                ConsultationPrice = 50,
                YearsOfExperience = 9,
                Rating = 4.7,
                ReviewCount = 64,
                ImageUrl = "",
                AcceptsInsurance = true,
                InsuranceProviders = "EOPYY",
                OffersOnlineConsultation = true,
                IsVerified = true,
                IsActive = true,
                Latitude = 39.6650,
                Longitude = 20.8537,
                Languages = "Greek, English"
            },

            new()
            {
                FirstName = "Σοφία",
                LastName = "Αντωνοπούλου",
                Specialty = "Pediatrician",
                Subspecialty = "Developmental Pediatrics",
                City = "Patras",
                Area = "Center",
                Address = "Κορίνθου 210",
                Bio = "Pediatrician providing preventive care, developmental monitoring and general pediatric consultations.",
                Phone = "+30 2610 000 005",
                Email = "sofia.antonopoulou@example.com",
                Website = "",
                ConsultationPrice = 45,
                YearsOfExperience = 14,
                Rating = 5.0,
                ReviewCount = 183,
                ImageUrl = "",
                AcceptsInsurance = true,
                InsuranceProviders = "EOPYY, Eurolife",
                OffersOnlineConsultation = true,
                IsVerified = true,
                IsActive = true,
                Latitude = 38.2466,
                Longitude = 21.7346,
                Languages = "Greek, English"
            },

            new()
            {
                FirstName = "Νίκος",
                LastName = "Καραγιάννης",
                Specialty = "Orthopedic",
                Subspecialty = "Sports Injuries",
                City = "Athens",
                Area = "Ampelokipoi",
                Address = "Λεωφόρος Αλεξάνδρας 156",
                Bio = "Orthopedic doctor specializing in musculoskeletal conditions, sports injuries and orthopedic assessment.",
                Phone = "+30 210 000 0006",
                Email = "nikos.karagiannis@example.com",
                Website = "",
                ConsultationPrice = 55,
                YearsOfExperience = 11,
                Rating = 4.8,
                ReviewCount = 118,
                ImageUrl = "",
                AcceptsInsurance = true,
                InsuranceProviders = "EOPYY, Interamerican",
                OffersOnlineConsultation = false,
                IsVerified = true,
                IsActive = true,
                Latitude = 37.9900,
                Longitude = 23.7550,
                Languages = "Greek, English"
            },

            new()
            {
                FirstName = "Άννα",
                LastName = "Γεωργίου",
                Specialty = "Dermatologist",
                Subspecialty = "Aesthetic Dermatology",
                City = "Thessaloniki",
                Area = "City Center",
                Address = "Μητροπόλεως 38",
                Bio = "Dermatologist with experience in general dermatology, skin conditions and personalized treatment plans.",
                Phone = "+30 2310 000 007",
                Email = "anna.georgiou@example.com",
                Website = "",
                ConsultationPrice = 50,
                YearsOfExperience = 8,
                Rating = 4.6,
                ReviewCount = 73,
                ImageUrl = "",
                AcceptsInsurance = false,
                InsuranceProviders = "",
                OffersOnlineConsultation = true,
                IsVerified = true,
                IsActive = true,
                Latitude = 40.6325,
                Longitude = 22.9410,
                Languages = "Greek, English, German"
            },

            new()
            {
                FirstName = "Παναγιώτης",
                LastName = "Ζέρβας",
                Specialty = "Neurologist",
                Subspecialty = "Clinical Neurology",
                City = "Athens",
                Area = "Ilisia",
                Address = "Μιχαλακοπούλου 92",
                Bio = "Neurologist focused on diagnostic evaluation, headaches, neurological disorders and patient follow-up.",
                Phone = "+30 210 000 0008",
                Email = "panagiotis.zervas@example.com",
                Website = "",
                ConsultationPrice = 65,
                YearsOfExperience = 17,
                Rating = 4.9,
                ReviewCount = 141,
                ImageUrl = "",
                AcceptsInsurance = true,
                InsuranceProviders = "EOPYY, Generali",
                OffersOnlineConsultation = true,
                IsVerified = true,
                IsActive = true,
                Latitude = 37.9795,
                Longitude = 23.7605,
                Languages = "Greek, English"
            }
        };

        foreach (var doctor in doctors)
        {
            var existingDoctor =
                await db.Doctors.FirstOrDefaultAsync(
                    d =>
                        d.FirstName == doctor.FirstName &&
                        d.LastName == doctor.LastName);

            if (existingDoctor is null)
            {
                db.Doctors.Add(doctor);
                continue;
            }

            existingDoctor.Subspecialty = doctor.Subspecialty;
            existingDoctor.Area = doctor.Area;
            existingDoctor.Phone = doctor.Phone;
            existingDoctor.Email = doctor.Email;
            existingDoctor.Website = doctor.Website;
            existingDoctor.YearsOfExperience = doctor.YearsOfExperience;
            existingDoctor.ReviewCount = doctor.ReviewCount;
            existingDoctor.AcceptsInsurance = doctor.AcceptsInsurance;
            existingDoctor.InsuranceProviders = doctor.InsuranceProviders;
            existingDoctor.OffersOnlineConsultation =
                doctor.OffersOnlineConsultation;
            existingDoctor.IsVerified = doctor.IsVerified;
            existingDoctor.IsActive = doctor.IsActive;
            existingDoctor.Latitude = doctor.Latitude;
            existingDoctor.Longitude = doctor.Longitude;
            existingDoctor.Languages = doctor.Languages;
        }

        await db.SaveChangesAsync();
    }
}