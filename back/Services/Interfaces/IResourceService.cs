using Back.Models;
using Microsoft.AspNetCore.Mvc;

namespace Back.Services.Interfaces
{
    public interface IResourceService
    {
        Task<Resource> CreateResourceAsync(Resource resource);
        Task ArchiveResourceAsync(int id);
        Task<bool> IsResourceUsedAsync(int id);
     
    }
}
