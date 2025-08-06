using Back.Models;

namespace Back.Services.Interfaces
{
    public interface IDocumentService
    {
        Task<Document> CreateDocumentAsync(Document document);
        Task DeleteDocumentAsync(int id);
        Task<bool> IsDocumentUsedAsync(int id);
    }
}
