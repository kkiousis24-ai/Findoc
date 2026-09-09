using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Findoc.Api.Migrations
{
    /// <inheritdoc />
    public partial class ExpandDoctorProfile : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "AcceptsInsurance",
                table: "Doctors",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Area",
                table: "Doctors",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Doctors",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "InsuranceProviders",
                table: "Doctors",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Doctors",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsVerified",
                table: "Doctors",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Languages",
                table: "Doctors",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<double>(
                name: "Latitude",
                table: "Doctors",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Longitude",
                table: "Doctors",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "OffersOnlineConsultation",
                table: "Doctors",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Phone",
                table: "Doctors",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "ReviewCount",
                table: "Doctors",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Subspecialty",
                table: "Doctors",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Website",
                table: "Doctors",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "YearsOfExperience",
                table: "Doctors",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AcceptsInsurance",
                table: "Doctors");

            migrationBuilder.DropColumn(
                name: "Area",
                table: "Doctors");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "Doctors");

            migrationBuilder.DropColumn(
                name: "InsuranceProviders",
                table: "Doctors");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Doctors");

            migrationBuilder.DropColumn(
                name: "IsVerified",
                table: "Doctors");

            migrationBuilder.DropColumn(
                name: "Languages",
                table: "Doctors");

            migrationBuilder.DropColumn(
                name: "Latitude",
                table: "Doctors");

            migrationBuilder.DropColumn(
                name: "Longitude",
                table: "Doctors");

            migrationBuilder.DropColumn(
                name: "OffersOnlineConsultation",
                table: "Doctors");

            migrationBuilder.DropColumn(
                name: "Phone",
                table: "Doctors");

            migrationBuilder.DropColumn(
                name: "ReviewCount",
                table: "Doctors");

            migrationBuilder.DropColumn(
                name: "Subspecialty",
                table: "Doctors");

            migrationBuilder.DropColumn(
                name: "Website",
                table: "Doctors");

            migrationBuilder.DropColumn(
                name: "YearsOfExperience",
                table: "Doctors");
        }
    }
}
