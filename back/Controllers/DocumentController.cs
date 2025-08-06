using Back.Models;
using Back.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Back.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DocumentController(IDocumentService documentService, WarehouseDbContext context) : ControllerBase
    {
        private readonly IDocumentService _documentService = documentService;
        private readonly WarehouseDbContext _context = context;

        // GET: api/documents
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Document>>> GetDocuments()
        {
            return await _context.Documents.OrderBy(d => d.Date).ToListAsync();
        }

        // GET: api/documents/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Document>> GetDocument(int id)
        {
            var document = await _context.Documents.FirstOrDefaultAsync(d => d.Id == id);
            if (document == null)
                return NotFound();
            return document;
        }

        // POST: api/documents
        [HttpPost]
        public async Task<ActionResult<Document>> PostDocument(Document document)
        {
            try
            {
                var createdDocument = await _documentService.CreateDocumentAsync(document);
                return CreatedAtAction(nameof(GetDocument), new { id = createdDocument.Id }, createdDocument);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // DELETE: api/documents/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDocument(int id)
        {
            try
            {
                await _documentService.DeleteDocumentAsync(id);
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
    }
}
