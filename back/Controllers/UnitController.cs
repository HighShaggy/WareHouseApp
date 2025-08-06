using Back.Models;
using Back.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Back.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UnitController(IUnitService unitService, WarehouseDbContext context) : ControllerBase
    {
        private readonly IUnitService _unitService = unitService;
        private readonly WarehouseDbContext _context = context;

        // GET: api/units
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Unit>>> GetUnits()
        {
            return await _context.Units
                .Where(u => u.IsActive)
                .OrderBy(u => u.Name)
                .ToListAsync();
        }

        // POST: api/units
        [HttpPost]
        public async Task<ActionResult<Unit>> PostUnit(Unit unit)
        {
            var createdUnit = await _unitService.CreateUnitAsync(unit);
            return CreatedAtAction(nameof(GetUnits), new { id = createdUnit.Id }, createdUnit);
        }

        // DELETE: api/units/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUnit(int id)
        {
            await _unitService.ArchiveUnitAsync(id);
            return NoContent();
        }
    }
}