using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SwiftServe.Migrations
{
    /// <inheritdoc />
    public partial class AddDeliveryOptionToOrder : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DeliveryOption",
                table: "Orders",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DeliveryOption",
                table: "Orders");
        }
    }
}
