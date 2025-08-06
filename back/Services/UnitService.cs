using Back.Models;
using Back.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Back.Services
{
    public class UnitService(WarehouseDbContext context) : IUnitService
    {
        private readonly WarehouseDbContext _context = context;

        public async Task<Unit> CreateUnitAsync(Unit unit)
        {
            if (await _context.Units.AnyAsync(u => u.Name == unit.Name))
                throw new InvalidOperationException("Единица измерения с таким наименованием уже существует");
            unit.IsActive = true;
            _context.Units.Add(unit);
            await _context.SaveChangesAsync();

            return unit;
        }

        public async Task ArchiveUnitAsync(int id)
        {
            var unit = await _context.Units.FindAsync(id);
            if (unit == null)
                throw new KeyNotFoundException("Единица измерения не найдена");

            if (await IsUnitUsedAsync(id))
                throw new InvalidOperationException("Невозможно архивировать единицу измерения, так как она используется в документах");

            unit.IsActive = false;
            await _context.SaveChangesAsync();
        }

        public async Task<bool> IsUnitUsedAsync(int id)
        {
            return await _context.Receipts.AnyAsync(r => r.UnitOfMeasureId == id);
        }
    }
}
