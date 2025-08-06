using Back.Models;
using Back.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Back.Services
{
    public class DocumentService(WarehouseDbContext context) : IDocumentService
    {
        private readonly WarehouseDbContext _context = context;

        public async Task<Document> CreateDocumentAsync(Document document)
        {
            if (await _context.Documents.AnyAsync(d => d.Number == document.Number))
                throw new InvalidOperationException("Документ с таким номером уже существует");

            _context.Documents.Add(document);
            await _context.SaveChangesAsync();

            return document;
        }

        public async Task DeleteDocumentAsync(int id)
        {
            var document = await _context.Documents.FindAsync(id);
            if (document == null)
            {
                throw new KeyNotFoundException("Документ не найден");
            }

            if (await IsDocumentUsedAsync(id))
            {
                throw new InvalidOperationException("Невозможно удалить документ, так как он используется в поступлениях");
            }

            _context.Documents.Remove(document);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> IsDocumentUsedAsync(int id)
        {
            return await _context.Receipts.AnyAsync(r => r.ReceiptDocumentId == id);
        }
    }
}