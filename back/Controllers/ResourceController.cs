using Back.Models;
using Back.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Back.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ResourceController(IResourceService resourceService, WarehouseDbContext context) : ControllerBase
    {
        private readonly IResourceService _resourceService = resourceService;
        private readonly WarehouseDbContext _context = context;

        // GET: api/resources
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Resource>>> GetResources()
        {
            return await _context.Resources
                .Where(r => r.IsActive)
                .OrderBy(r => r.Name)
                .ToListAsync();
        }

        // GET: api/resources/archived
        [HttpGet("archived")]
        public async Task<ActionResult<IEnumerable<Resource>>> GetArchivedResources()
        {
            return await _context.Resources
                .Where(r => !r.IsActive)
                .OrderBy(r => r.Name)
                .ToListAsync();
        }

        // GET: api/resources/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Resource>> GetResource(int id)
        {
            var resource = await _context.Resources.FindAsync(id);

            if (resource == null)
            {
                return NotFound("Ресурс не найден");
            }

            return resource;
        }

        // POST: api/resources
        [HttpPost]
        public async Task<ActionResult<Resource>> PostResource(Resource resource)
        {
            try
            {
                var createdResource = await _resourceService.CreateResourceAsync(resource);
                return CreatedAtAction(nameof(GetResource), new { id = createdResource.Id }, createdResource);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // PUT: api/resources/5/archive
        [HttpPut("{id}/archive")]
        public async Task<IActionResult> ArchiveResource(int id)
        {
            try
            {
                await _resourceService.ArchiveResourceAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // PUT: api/resources/5/restore
        [HttpPut("{id}/restore")]
        public async Task<IActionResult> RestoreResource(int id)
        {
            var resource = await _context.Resources.FindAsync(id);
            if (resource == null)
            {
                return NotFound("Ресурс не найден");
            }

            resource.IsActive = true;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/resources/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteResource(int id)
        {
            var resource = await _context.Resources.FindAsync(id);
            if (resource == null)
            {
                return NotFound("Ресурс не найден");
            }

            if (await _resourceService.IsResourceUsedAsync(id))
            {
                return BadRequest("Невозможно удалить ресурс, так как он используется в документах");
            }

            _context.Resources.Remove(resource);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}

