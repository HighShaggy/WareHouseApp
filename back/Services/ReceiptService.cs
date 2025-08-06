using Back.Models;
using Back.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Back.Services
{
    public class ReceiptService : IReceiptService
    {
        private readonly WarehouseDbContext _context;

        public ReceiptService(WarehouseDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Receipt>> GetReceiptsAsync()
        {
            return await _context.Receipts

                .ToListAsync();
        }

        public async Task<Receipt?> GetReceiptAsync(int id)
        {
            return await _context.Receipts
               
                .FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task<Receipt> CreateReceiptAsync(Receipt receipt)
        {
            _context.Receipts.Add(receipt);
            await _context.SaveChangesAsync();
            return receipt;
        }

        public async Task UpdateReceiptAsync(int id, Receipt receipt)
        {
            if (id != receipt.Id)
                throw new ArgumentException("Id не совпадает с Receipt.Id");

            _context.Entry(receipt).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteReceiptAsync(int id)
        {
            var receipt = await _context.Receipts.FindAsync(id);
            if (receipt == null)
                throw new KeyNotFoundException("Поступление не найдено");

            _context.Receipts.Remove(receipt);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> ReceiptExistsAsync(int id)
        {
            return await _context.Receipts.AnyAsync(e => e.Id == id);
        }
    }
}