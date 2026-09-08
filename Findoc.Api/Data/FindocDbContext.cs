using Findoc.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Findoc.Api.Data;

public class FindocDbContext : DbContext
{
    public FindocDbContext(
        DbContextOptions<FindocDbContext> options)
        : base(options)
    {
    }

    public DbSet<Doctor> Doctors => Set<Doctor>();

    public DbSet<Appointment> Appointments =>
        Set<Appointment>();

    public DbSet<ApplicationUser> Users =>
        Set<ApplicationUser>();

    protected override void OnModelCreating(
        ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<ApplicationUser>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<Appointment>()
            .HasIndex(a => new
            {
                a.DoctorId,
                a.StartsAt
            })
            .IsUnique();

        modelBuilder.Entity<Appointment>()
            .HasOne(a => a.Doctor)
            .WithMany(d => d.Appointments)
            .HasForeignKey(a => a.DoctorId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Appointment>()
            .HasOne(a => a.User)
            .WithMany(u => u.Appointments)
            .HasForeignKey(a => a.UserId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}