using Back.Models;
using Microsoft.EntityFrameworkCore;

namespace Back
{
    public class WarehouseDbContext : DbContext
    {
        public WarehouseDbContext(DbContextOptions<WarehouseDbContext> options)
            : base(options) { }

        public DbSet<Resource> Resources { get; set; }
        public DbSet<Unit> Units { get; set; }
        public DbSet<Document> Documents { get; set; }
        public DbSet<Receipt> Receipts { get; set; }
    }
}
