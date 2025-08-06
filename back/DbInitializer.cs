using Back;
using Back.Models;

public static class DbInitializer
{
    public static void Initialize(WarehouseDbContext context)
    {
        context.Database.EnsureCreated();

        // Resources
        if (!context.Resources.Any())
        {
            var resources = new Resource[]
            {
                new() { Name = "Древесина", IsActive = true },
                new() { Name = "Металл", IsActive = true },
                new() { Name = "Пластик", IsActive = true }
            };
            context.Resources.AddRange(resources);
            context.SaveChanges();
        }

        // Units
        if (!context.Units.Any())
        {
            var units = new Unit[]
            {
                new() { Name = "кг", IsActive = true },
                new() { Name = "шт", IsActive = true },
                new() { Name = "м", IsActive = true },
                new() { Name = "кг", IsActive = true },
            };
            context.Units.AddRange(units);
            context.SaveChanges();
        }

        // Documents
        if (!context.Documents.Any())
        {
            var documents = new Document[]
            {
                new() { Number = "ПР-001", Date = DateTime.Today },
                new() { Number = "ПР-002", Date = DateTime.Today.AddDays(-1) },
                new() { Number = "ПР-003", Date = DateTime.Today.AddDays(-2) }
            };
            context.Documents.AddRange(documents);
            context.SaveChanges();
        }

        // Receipts
        if (!context.Receipts.Any())
        {
            var resourceIds = context.Resources.Select(r => r.Id).ToArray();
            var unitIds = context.Units.Select(u => u.Id).ToArray();
            var documentIds = context.Documents.Select(d => d.Id).ToArray();

            var random = new Random();

            var receipts = new Receipt[]
            {
                new()
                {
                    ResourceId = resourceIds.ElementAtOrDefault(0),
                    UnitOfMeasureId = unitIds.ElementAtOrDefault(0),
                    ReceiptDocumentId = documentIds.ElementAtOrDefault(0),
                    Quantity = random.Next(1, 1000)
                },
                new()
                {
                    ResourceId = resourceIds.ElementAtOrDefault(1),
                    UnitOfMeasureId = unitIds.ElementAtOrDefault(1),
                    ReceiptDocumentId = documentIds.ElementAtOrDefault(1),
                    Quantity = random.Next(1, 1000)
                },
                new()
                {
                    ResourceId = resourceIds.ElementAtOrDefault(2),
                    UnitOfMeasureId = unitIds.ElementAtOrDefault(2),
                    ReceiptDocumentId = documentIds.ElementAtOrDefault(2),
                    Quantity = random.Next(1, 1000)
                }
            };
            context.Receipts.AddRange(receipts);
            context.SaveChanges();
        }
    }
}