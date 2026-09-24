using SMM.Application.Posts.DTOs;

namespace SSM.Application.Post;

public interface IPostService
{
    Task<PostResponse> UpdatePostAsync(Guid userId, Guid postId, UpdatePostRequest request);
    Task<bool> DeletePostAsync(Guid userId, Guid postId);
}