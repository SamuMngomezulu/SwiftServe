namespace SwiftServe.Dtos
{
    public class TransactionDto
    {
        public int TransactionID { get; set; }
        public decimal TransactionAmount { get; set; }
        public string TypeName { get; set; }
        public string StatusName { get; set; }
        public DateTime Date { get; set; }
        public int? OrderID { get; set; }
    }
}
