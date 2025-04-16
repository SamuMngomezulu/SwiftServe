using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SwiftServe.Migrations
{
    /// <inheritdoc />
    public partial class AddImagePublicIdToProduct : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ImagePublicId",
                table: "Products",
                newName: "ImagePublicID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ImagePublicID",
                table: "Products",
                newName: "ImagePublicId");
        }
    }
}
