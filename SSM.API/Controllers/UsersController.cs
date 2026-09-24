using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SMM.Infrastructure.Persistence;
using System.Security.Claims;

namespace SMM.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public UsersController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [Authorize]
    [HttpGet("me")]
    public IActionResult Me()
    {
        var userId = User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );

        var email = User.FindFirstValue(
            ClaimTypes.Email
        );

        return Ok(new
        {
            userId,
            email
        });
    }

    [Authorize]
    [HttpGet("search")]
    public async Task<IActionResult> SearchUsers(
    [FromQuery] string? search,
    CancellationToken cancellationToken)
    {
        var currentUserId = Guid.Parse(
            User.FindFirstValue(
                ClaimTypes.NameIdentifier
            )!
        );

        var query = _dbContext.Users
            .AsNoTracking()
            .Where(x => x.Id != currentUserId);

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim();

            query = query.Where(x =>
                x.FirstName.Contains(term) ||
                x.LastName.Contains(term) ||
                x.UserName!.Contains(term)
            );
        }

        var users = await query
            .OrderBy(x => x.FirstName)
            .Take(30)
            .Select(x => new
            {
                x.Id,
                x.FirstName,
                x.LastName,
                x.UserName,
                x.ProfileImageUrl
            })
            .ToListAsync(cancellationToken);

        return Ok(users);
    }
}