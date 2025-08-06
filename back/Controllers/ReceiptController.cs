using Back.Models;
using Back.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Back.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReceiptController(IReceiptService receiptService) : ControllerBase
    {
        private readonly IReceiptService _receiptService = receiptService;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Receipt>>> GetReceipts()
        {
            var receipts = await _receiptService.GetReceiptsAsync();
            return Ok(receipts);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Receipt>> GetReceipt(int id)
        {
            var receipt = await _receiptService.GetReceiptAsync(id);
            if (receipt == null)
                return NotFound();
            return Ok(receipt);
        }

        [HttpPost]
        public async Task<ActionResult<Receipt>> PostReceipt(Receipt receipt)
        {
            var created = await _receiptService.CreateReceiptAsync(receipt);
            return CreatedAtAction(nameof(GetReceipt), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutReceipt(int id, Receipt receipt)
        {
            if (id != receipt.Id)
                return BadRequest();

            try
            {
                await _receiptService.UpdateReceiptAsync(id, receipt);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReceipt(int id)
        {
            try
            {
                await _receiptService.DeleteReceiptAsync(id);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }

            return NoContent();
        }
    }
}