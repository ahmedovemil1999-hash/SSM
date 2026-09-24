using Microsoft.EntityFrameworkCore;
using SMM.Application.Posts.DTOs;
using SMM.Domain.Entities;
using SMM.Infrastructure.Persistence;
using SSM.Application.Post;

namespace SSM.Infrastructure.Persistance;

public class PostService : IPostService
{
    private readonly AppDbContext _context;

    public PostService(AppDbContext context)
    {
        _context = context;
    }


    public async Task<PostResponse> UpdatePostAsync(Guid userId, Guid postId, UpdatePostRequest request)
    {
        var post = await _context.Posts
            .FirstOrDefaultAsync(p => p.Id == postId && p.UserId == userId);

        if (post == null)
            throw new Exception("Gönderi bulunamadı veya düzenleme yetkiniz yok.");

        post.Content = request.Content;

        if (request.RemoveImage)
        {
            post.ImageUrl = null;
        }

        if (request.RemoveVideo)
        {
            post.VideoUrl = null;
        }

        _context.Posts.Update(post);
        await _context.SaveChangesAsync();

        return new PostResponse
        {
            Id = post.Id,
            Content = post.Content,
            ImageUrl = post.ImageUrl,
            VideoUrl = post.VideoUrl
        };
    }

  
    public async Task<bool> DeletePostAsync(Guid userId, Guid postId)
    {
        var post = await _context.Posts
            .FirstOrDefaultAsync(p => p.Id == postId && p.UserId == userId);

        if (post == null)
            return false;

        _context.Posts.Remove(post);
        await _context.SaveChangesAsync();

        return true;
    }
}