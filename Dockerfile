# ======================================================
# BUILD STAGE
# ======================================================

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

WORKDIR /src

COPY Findoc.Api/Findoc.Api.csproj Findoc.Api/

RUN dotnet restore Findoc.Api/Findoc.Api.csproj

COPY Findoc.Api/ Findoc.Api/

WORKDIR /src/Findoc.Api

RUN dotnet publish \
    Findoc.Api.csproj \
    --configuration Release \
    --output /app/publish \
    --no-restore

# ======================================================
# RUNTIME STAGE
# ======================================================

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime

WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://0.0.0.0:10000

EXPOSE 10000

ENTRYPOINT ["dotnet", "Findoc.Api.dll"]