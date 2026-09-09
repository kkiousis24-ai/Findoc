using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;

namespace Findoc.Api.Services;

public sealed class DoctorSearchFilters
{
    public string? Specialty { get; set; }

    public string? City { get; set; }

    public string? Area { get; set; }

    public decimal? MaxPrice { get; set; }

    public double? MinRating { get; set; }

    public bool? AcceptsInsurance { get; set; }

    public string? Insurance { get; set; }

    public bool? Online { get; set; }

    public string? Language { get; set; }

    public bool? Verified { get; set; }

    public string Sort { get; set; } = "rating";
}

public static class DoctorSearchParser
{
    private static readonly Dictionary<string, string>
        SpecialtyMap =
            new(StringComparer.OrdinalIgnoreCase)
            {
                ["καρδιολογος"] = "Cardiologist",
                ["καρδιολογο"] = "Cardiologist",
                ["καρδιολογοι"] = "Cardiologist",
                ["cardiologist"] = "Cardiologist",

                ["δερματολογος"] = "Dermatologist",
                ["δερματολογο"] = "Dermatologist",
                ["δερματολογοι"] = "Dermatologist",
                ["dermatologist"] = "Dermatologist",

                ["νευρολογος"] = "Neurologist",
                ["νευρολογο"] = "Neurologist",
                ["νευρολογοι"] = "Neurologist",
                ["neurologist"] = "Neurologist",

                ["παιδιατρος"] = "Pediatrician",
                ["παιδιατρο"] = "Pediatrician",
                ["παιδιατροι"] = "Pediatrician",
                ["pediatrician"] = "Pediatrician",

                ["ορθοπαιδικος"] = "Orthopedic",
                ["ορθοπαιδικο"] = "Orthopedic",
                ["ορθοπεδικος"] = "Orthopedic",
                ["ορθοπεδικο"] = "Orthopedic",
                ["orthopedic"] = "Orthopedic"
            };

    private static readonly Dictionary<string, string>
        CityMap =
            new(StringComparer.OrdinalIgnoreCase)
            {
                ["αθηνα"] = "Athens",
                ["αθηνας"] = "Athens",
                ["athens"] = "Athens",

                ["θεσσαλονικη"] = "Thessaloniki",
                ["θεσσαλονικης"] = "Thessaloniki",
                ["thessaloniki"] = "Thessaloniki",

                ["πατρα"] = "Patras",
                ["πατρας"] = "Patras",
                ["patras"] = "Patras",

                ["ιωαννινα"] = "Ioannina",
                ["γιαννενα"] = "Ioannina",
                ["ioannina"] = "Ioannina"
            };

    private static readonly Dictionary<string, string>
        AreaMap =
            new(StringComparer.OrdinalIgnoreCase)
            {
                ["κολωνακι"] = "Kolonaki",

                ["αμπελοκηποι"] = "Ampelokipoi",

                ["ιλισια"] = "Ilisia",

                ["κεντρο"] = "Center",

                ["city center"] = "City Center"
            };

    private static readonly Dictionary<string, string>
        InsuranceMap =
            new(StringComparer.OrdinalIgnoreCase)
            {
                ["εοπυυ"] = "EOPYY",
                ["eopyy"] = "EOPYY",

                ["interamerican"] = "Interamerican",

                ["generali"] = "Generali",

                ["eurolife"] = "Eurolife"
            };

    private static readonly Dictionary<string, string>
        LanguageMap =
            new(StringComparer.OrdinalIgnoreCase)
            {
                ["ελληνικα"] = "Greek",
                ["greek"] = "Greek",

                ["αγγλικα"] = "English",
                ["english"] = "English",

                ["γαλλικα"] = "French",
                ["french"] = "French",

                ["γερμανικα"] = "German",
                ["german"] = "German"
            };

    public static DoctorSearchFilters Parse(
        string input)
    {
        var filters =
            new DoctorSearchFilters();

        if (string.IsNullOrWhiteSpace(input))
        {
            return filters;
        }

        var normalized =
            Normalize(input);

        filters.Specialty =
            FindMappedValue(
                normalized,
                SpecialtyMap);

        filters.City =
            FindMappedValue(
                normalized,
                CityMap);

        filters.Area =
            FindMappedValue(
                normalized,
                AreaMap);

        filters.Insurance =
            FindMappedValue(
                normalized,
                InsuranceMap);

        filters.Language =
            FindMappedValue(
                normalized,
                LanguageMap);

        if (filters.Insurance is not null)
        {
            filters.AcceptsInsurance = true;
        }
        else if (
            ContainsAny(
                normalized,
                "με ασφαλιση",
                "δεχεται ασφαλιση",
                "δεχονται ασφαλιση",
                "με ασφαλιστικη καλυψη",
                "insurance"))
        {
            filters.AcceptsInsurance = true;
        }

        if (
            ContainsAny(
                normalized,
                "online",
                "βιντεοκληση",
                "βιντεο κληση",
                "τηλεσυνεδρια",
                "τηλεϊατρικη",
                "τηλειατρικη",
                "remote consultation"))
        {
            filters.Online = true;
        }

        if (
            ContainsAny(
                normalized,
                "επαληθευμενος",
                "επαληθευμενο",
                "verified"))
        {
            filters.Verified = true;
        }

        filters.MaxPrice =
            ExtractMaximumPrice(
                normalized);

        filters.MinRating =
            ExtractMinimumRating(
                normalized);

        filters.Sort =
            ExtractSort(normalized);

        return filters;
    }

    private static string? FindMappedValue(
        string normalizedInput,
        IReadOnlyDictionary<string, string> map)
    {
        foreach (var item in map)
        {
            if (normalizedInput.Contains(
                    item.Key,
                    StringComparison.OrdinalIgnoreCase))
            {
                return item.Value;
            }
        }

        return null;
    }

    private static decimal? ExtractMaximumPrice(
        string input)
    {
        var patterns =
            new[]
            {
                @"(?:μεχρι|εως|ως|max|maximum|under|below)\s*(?:τα\s*)?(\d+(?:[.,]\d+)?)\s*(?:€|ευρω|euro)?",

                @"(\d+(?:[.,]\d+)?)\s*(?:€|ευρω|euro)\s*(?:και\s*)?(?:κατω|maximum|max)",

                @"(?:κοστος|τιμη)\s*(?:μεχρι|εως|max)?\s*(\d+(?:[.,]\d+)?)"
            };

        foreach (var pattern in patterns)
        {
            var match =
                Regex.Match(
                    input,
                    pattern,
                    RegexOptions.IgnoreCase);

            if (!match.Success)
            {
                continue;
            }

            var value =
                match.Groups[1]
                    .Value
                    .Replace(',', '.');

            if (decimal.TryParse(
                    value,
                    NumberStyles.Number,
                    CultureInfo.InvariantCulture,
                    out var price))
            {
                return price;
            }
        }

        return null;
    }

    private static double? ExtractMinimumRating(
        string input)
    {
        var patterns =
            new[]
            {
                @"(?:rating|βαθμολογια|αξιολογηση)\s*(?:πανω\s*απο|τουλαχιστον|>=|απο)?\s*(\d(?:[.,]\d)?)",

                @"(\d(?:[.,]\d)?)\s*\+\s*(?:rating|βαθμολογια|αστερια)?",

                @"(?:πανω\s*απο|τουλαχιστον)\s*(\d(?:[.,]\d)?)\s*(?:αστερια|rating)?"
            };

        foreach (var pattern in patterns)
        {
            var match =
                Regex.Match(
                    input,
                    pattern,
                    RegexOptions.IgnoreCase);

            if (!match.Success)
            {
                continue;
            }

            var value =
                match.Groups[1]
                    .Value
                    .Replace(',', '.');

            if (double.TryParse(
                    value,
                    NumberStyles.Float,
                    CultureInfo.InvariantCulture,
                    out var rating))
            {
                if (rating >= 0 &&
                    rating <= 5)
                {
                    return rating;
                }
            }
        }

        return null;
    }

    private static string ExtractSort(
        string input)
    {
        if (
            ContainsAny(
                input,
                "φθηνοτερο",
                "φθηνοτερος",
                "χαμηλοτερη τιμη",
                "cheapest",
                "lowest price"))
        {
            return "price_asc";
        }

        if (
            ContainsAny(
                input,
                "ακριβοτερο",
                "ακριβοτερος",
                "υψηλοτερη τιμη",
                "highest price"))
        {
            return "price_desc";
        }

        if (
            ContainsAny(
                input,
                "περισσοτερη εμπειρια",
                "πιο εμπειρος",
                "πιο εμπειρη",
                "most experienced"))
        {
            return "experience";
        }

        if (
            ContainsAny(
                input,
                "περισσοτερες κριτικες",
                "περισσοτερες αξιολογησεις",
                "most reviews"))
        {
            return "reviews";
        }

        return "rating";
    }

    private static bool ContainsAny(
        string input,
        params string[] values)
    {
        return values.Any(
            value =>
                input.Contains(
                    value,
                    StringComparison.OrdinalIgnoreCase));
    }

    private static string Normalize(
        string value)
    {
        var normalized =
            value
                .Trim()
                .ToLowerInvariant()
                .Normalize(
                    NormalizationForm.FormD);

        var builder =
            new StringBuilder();

        foreach (var character in normalized)
        {
            var category =
                CharUnicodeInfo.GetUnicodeCategory(
                    character);

            if (category !=
                UnicodeCategory.NonSpacingMark)
            {
                builder.Append(character);
            }
        }

        return builder
            .ToString()
            .Normalize(
                NormalizationForm.FormC);
    }
}