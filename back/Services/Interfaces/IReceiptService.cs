using Back.Models;

namespace Back.Services.Interfaces
{
    public interface IReceiptService
    {
        Task<IEnumerable<Receipt>> GetReceiptsAsync();
        Task<Receipt?> GetReceiptAsync(int id);
        Task<Receipt> CreateReceiptAsync(Receipt receipt);
        Task UpdateReceiptAsync(int id, Receipt receipt);
        Task DeleteReceiptAsync(int id);
        Task<bool> ReceiptExistsAsync(int id);
    }
}