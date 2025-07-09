using CADASTRO_API;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Data.SqlClient;
using System.Threading.Tasks;

namespace CADASTRO_API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CadastroController : ControllerBase
    {
        private readonly ILogger<CadastroController> _logger;

        public const string ConnectionString = "Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=Cadastro;Integrated Security=True;Connect Timeout=30;Encrypt=False;TrustServerCertificate=False;ApplicationIntent=ReadWrite;MultiSubnetFailover=False";

        public CadastroController(ILogger<CadastroController> logger)
        {
            _logger = logger;
        }

        [HttpPost("Cadastro")]
        public async Task<ActionResult<bool>> EfetuarCadastro([FromBody] Cadastro cadastro)
        {
            if (cadastro == null || string.IsNullOrEmpty(cadastro.Nome) || string.IsNullOrEmpty(cadastro.Senha) || string.IsNullOrEmpty(cadastro.Email))
            {
                return BadRequest("Dados inválidos");
            }

            try
            {
                using (SqlConnection connection = new SqlConnection(ConnectionString))
                {
                    await connection.OpenAsync();

                    string query = "INSERT INTO Usuário (nome, email, senha) VALUES (@nome, @email, @senha)";
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.Add("@nome", System.Data.SqlDbType.NVarChar).Value = cadastro.Nome;
                        command.Parameters.Add("@senha", System.Data.SqlDbType.NVarChar).Value = cadastro.Senha;
                        command.Parameters.Add("@email", System.Data.SqlDbType.NVarChar).Value = cadastro.Email;

                        int result = await command.ExecuteNonQueryAsync();

                        if (result > 0)
                        {
                            return Ok(true); // Registro inserido com sucesso
                        }
                        else
                        {
                            return BadRequest("Falha ao cadastrar");
                        }
                    }
                }
            }
            catch (SqlException sqlEx)
            {
                _logger.LogError(sqlEx, "Erro ao cadastrar usuário: {Message}", sqlEx.Message);
                return StatusCode(500, "Erro ao acessar o banco de dados " + sqlEx.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao cadastrar usuário");
                return StatusCode(500, "Erro interno no servidor");
            }
        }

        [HttpPost("Login")]
        public async Task<ActionResult<object>> EfetuarLogin([FromBody] Login login)
        {
            if (login == null || string.IsNullOrEmpty(login.Email) || string.IsNullOrEmpty(login.Senha))
            {
                return BadRequest("Dados inválidos");
            }

            try
            {
                using (SqlConnection connection = new SqlConnection(ConnectionString))
                {
                    await connection.OpenAsync();

                    // Verificar se é um Usuário
                    string userQuery = "SELECT COUNT(*) FROM Usuário WHERE Email = @Email AND Senha = @Senha";
                    using (SqlCommand userCommand = new SqlCommand(userQuery, connection))
                    {
                        userCommand.Parameters.AddWithValue("@Email", login.Email);
                        userCommand.Parameters.AddWithValue("@Senha", login.Senha);

                        int userCount = (int)await userCommand.ExecuteScalarAsync();
                        if (userCount > 0)
                        {
                            // Retornar um objeto JSON ao invés de uma string
                            return Ok(new { message = "Login bem-sucedido" });
                        }
                    }

                    return Unauthorized(); // Retornar 401 se não for encontrado
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao efetuar login");
                return StatusCode(500, "Erro interno no servidor");
            }
        }
        [HttpGet("GetUser")]
        public async Task<ActionResult<object>> GetUser([FromQuery] string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest("Dados inválidos");
            }

            try
            {
                using (SqlConnection connection = new SqlConnection(ConnectionString))
                {
                    await connection.OpenAsync();

                    // Verificar se é um Usuário
                    string userQuery = "SELECT Nome FROM Usuário WHERE Email = @Email";
                    using (SqlCommand userCommand = new SqlCommand(userQuery, connection))
                    {
                        userCommand.Parameters.AddWithValue("@Email", email);

                        var nome = await userCommand.ExecuteScalarAsync();
                        if (nome != null)
                        {
                            return Ok(new { Nome = nome.ToString() }); // Return as JSON object
                        }
                        else
                        {
                            return NotFound("Usuário não encontrado"); // Return 404 if not found
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao encontrar nome");
                return StatusCode(500, "Erro interno no servidor");
            }
        }

    }
}
