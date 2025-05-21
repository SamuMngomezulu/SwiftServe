namespace SwiftServe.Dtos
{
    public class WalletDto
    {
        public int WalletID { get; set; }
        public int UserID { get; set; }
        public decimal Balance { get; set; }
        public List<TransactionDto> Transactions { get; set; }

    }
}
