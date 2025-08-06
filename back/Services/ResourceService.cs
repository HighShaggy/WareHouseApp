using Back.Models;
using Back.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Back.Services
{
    public class ResourceService(WarehouseDbContext context) : IResourceService
    {
        private readonly WarehouseDbContext _context = context;

        public async Task<Resource> CreateResourceAsync(Resource resource)
        {
            if (await _context.Resources.AnyAsync(r => r.Name == resource.Name))
                throw new InvalidOperationException("Ресурс с таким наименованием уже существует");
            resource.IsActive = true;
            _context.Resources.Add(resource);
            await _context.SaveChangesAsync();

            return resource;
        }

        public async Task ArchiveResourceAsync(int id)
        {
            var resource = await _context.Resources.FindAsync(id);
            if (resource == null)
            {
                throw new KeyNotFoundException("Ресурс не найден");
            }

            // Проверка использования ресурса
            if (await IsResourceUsedAsync(id))
            {
                throw new InvalidOperationException("Невозможно удалить ресурс, так как он используется в документах");
            }

            resource.IsActive = false;
            await _context.SaveChangesAsync();
        }

        public async Task<bool> IsResourceUsedAsync(int id)
        {
            return await _context.Receipts.AnyAsync(r => r.ResourceId == id);
        }
    }
}
