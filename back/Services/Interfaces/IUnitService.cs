using Back.Models;

namespace Back.Services.Interfaces
{
    public interface IUnitService
    {
        Task<Unit> CreateUnitAsync(Unit unit);
        Task ArchiveUnitAsync(int id);
        Task<bool> IsUnitUsedAsync(int id);
    }
}
