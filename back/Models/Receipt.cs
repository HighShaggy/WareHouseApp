namespace Back.Models
{
    public class Receipt
    {
        public int Id { get; set; }
        public int ResourceId { get; set; }
        public int UnitOfMeasureId { get; set; }
        public int ReceiptDocumentId { get; set; }
        public decimal Quantity { get; set; }
    }
}
