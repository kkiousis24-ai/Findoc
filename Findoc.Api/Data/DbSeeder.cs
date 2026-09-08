using Findoc.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Findoc.Api.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(FindocDbContext db)
    {
        if (await db.Doctors.AnyAsync())
        {
            return;
        }

        var doctors = new List<Doctor>
        {
            new()
            {
                FirstName = "Maria",
                LastName = "Papadopoulou",
                Specialty = "Cardiologist",
                City = "Athens",
                Address = "Leoforos Kifisias 100",
                Bio = "Experienced cardiologist with a focus on preventive cardiology, hypertension and cardiovascular health.",
                ConsultationPrice = 50,
                Rating = 4.9,
                ImageUrl = ""
            },

            new()
            {
                FirstName = "Γιώργος",
                LastName = "Νικολαΐδης",
                Specialty = "Cardiologist",
                City = "Thessaloniki",
                Address = "Τσιμισκή 85",
                Bio = "Cardiologist specializing in cardiovascular prevention, hypertension management and routine cardiac assessment.",
                ConsultationPrice = 55,
                Rating = 4.8,
                ImageUrl = ""
            },

            new()
            {
                FirstName = "Ελένη",
                LastName = "Μάρκου",
                Specialty = "Dermatologist",
                City = "Athens",
                Address = "Βασιλίσσης Σοφίας 112",
                Bio = "Dermatologist focused on clinical dermatology, skin health, acne treatment and preventive dermatological care.",
                ConsultationPrice = 60,
                Rating = 4.9,
                ImageUrl = ""
            },

            new()
            {
                FirstName = "Δημήτρης",
                LastName = "Βρεττός",
                Specialty = "Neurologist",
                City = "Ioannina",
                Address = "Δωδώνης 42",
                Bio = "Neurologist with experience in headache disorders, neurological assessment and long-term patient monitoring.",
                ConsultationPrice = 50,
                Rating = 4.7,
                ImageUrl = ""
            },

            new()
            {
                FirstName = "Σοφία",
                LastName = "Αντωνοπούλου",
                Specialty = "Pediatrician",
                City = "Patras",
                Address = "Κορίνθου 210",
                Bio = "Pediatrician providing preventive care, developmental monitoring and general pediatric consultations.",
                ConsultationPrice = 45,
                Rating = 5.0,
                ImageUrl = ""
            },

            new()
            {
                FirstName = "Νίκος",
                LastName = "Καραγιάννης",
                Specialty = "Orthopedic",
                City = "Athens",
                Address = "Λεωφόρος Αλεξάνδρας 156",
                Bio = "Orthopedic doctor specializing in musculoskeletal conditions, sports injuries and orthopedic assessment.",
                ConsultationPrice = 55,
                Rating = 4.8,
                ImageUrl = ""
            },

            new()
            {
                FirstName = "Άννα",
                LastName = "Γεωργίου",
                Specialty = "Dermatologist",
                City = "Thessaloniki",
                Address = "Μητροπόλεως 38",
                Bio = "Dermatologist with experience in general dermatology, skin conditions and personalized treatment plans.",
                ConsultationPrice = 50,
                Rating = 4.6,
                ImageUrl = ""
            },

            new()
            {
                FirstName = "Παναγιώτης",
                LastName = "Ζέρβας",
                Specialty = "Neurologist",
                City = "Athens",
                Address = "Μιχαλακοπούλου 92",
                Bio = "Neurologist focused on diagnostic evaluation, headaches, neurological disorders and patient follow-up.",
                ConsultationPrice = 65,
                Rating = 4.9,
                ImageUrl = ""
            }
        };

        await db.Doctors.AddRangeAsync(doctors);
        await db.SaveChangesAsync();
    }
}