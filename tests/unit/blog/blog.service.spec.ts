import { describe, should as s } from 'vitest';
import { IBlogRepository } from '../../../src/blog/domain/blog.repository';
import { anything, instance, mock, when } from 'ts-mockito';
import {
  Blog,
  BlogPrincipal,
} from '../../../src/blog/domain/models/blog.model';
import { CommentPrincipal } from '../../../src/blog/domain/models/comment.model';
import { ICommentRepository } from '../../../src/blog/domain/comment.repository';
import { BlogService } from '../../../src/blog/domain/blog.service';

const should = s();

type MockParams = {
  blog?: {
    search?: BlogPrincipal[];
    get?: BlogPrincipal | null;
    create?: BlogPrincipal;
    update?: BlogPrincipal;
  };
  comment?: {
    search?: CommentPrincipal[];
    get?: CommentPrincipal | null;
    create?: CommentPrincipal;
    update?: CommentPrincipal;
  };
};

const buildMock = (
  params: MockParams,
): [IBlogRepository, ICommentRepository] => {
  const commentMock = mock<ICommentRepository>();
  const blogMock = mock<IBlogRepository>();

  if (params.blog?.search)
    when(blogMock.search(anything(), anything(), anything())).thenResolve(
      params.blog.search,
    );
  if (params.blog?.get)
    when(blogMock.get(anything())).thenResolve(params.blog.get);
  if (params.blog?.create)
    when(blogMock.create(anything())).thenResolve(params.blog.create);
  if (params.blog?.update)
    when(blogMock.update(anything(), anything())).thenResolve(
      params.blog.update,
    );
  if (params.comment?.search)
    when(
      commentMock.search(anything(), anything(), anything(), anything()),
    ).thenResolve(params.comment.search);
  if (params.comment?.get)
    when(commentMock.get(anything(), anything())).thenResolve(
      params.comment.get,
    );
  if (params.comment?.create)
    when(commentMock.create(anything(), anything())).thenResolve(
      params.comment.create,
    );
  if (params.comment?.update)
    when(commentMock.update(anything(), anything(), anything())).thenResolve(
      params.comment.update,
    );

  const commentRepo = instance(commentMock);
  const blogRepo = instance(blogMock);
  return [blogRepo, commentRepo];
};

describe('IBlogService', () => {
  describe('search', () => {
    it('should return a list of blogs', async () => {
      const [blogRepo, commentRepo] = buildMock({
        blog: {
          search: [
            {
              record: {
                text: 'autem nihil nostrum',
                tags: ['tag1', 'tag2'],
              },
              id: 'e67c6ef1-151e-4eaf-aeb1-1a69ef83d56b',
            },
            {
              record: {
                text: 'Ex similique ullam beatae eos nulla odio tempore.',
                tags: ['green', 'blue'],
              },
              id: '2fbc8170-cb63-4119-8da5-38bd9c0f5e2b',
            },
          ],
        },
      });
      const subj = new BlogService(blogRepo, commentRepo);
      const ex = [
        {
          record: {
            text: 'autem nihil nostrum',
            tags: ['tag1', 'tag2'],
          },
          id: 'e67c6ef1-151e-4eaf-aeb1-1a69ef83d56b',
        },
        {
          record: {
            text: 'Ex similique ullam beatae eos nulla odio tempore.',
            tags: ['green', 'blue'],
          },
          id: '2fbc8170-cb63-4119-8da5-38bd9c0f5e2b',
        },
      ];

      const actual = await subj.search();

      actual.should.deep.equal(ex);
    });
  });

  describe('get', () => {
    describe('exist', () => {
      it('should return the blog with the id', async () => {
        const [blogRepo, commentRepo] = buildMock({
          blog: {
            get: {
              record: {
                text: 'autem nihil nostrum',
                tags: ['tag1', 'tag2'],
              },
              id: 'e67c6ef1-151e-4eaf-aeb1-1a69ef83d56b',
            },
          },
          comment: {
            search: [
              {
                record: {
                  text: 'L + Ratio',
                  likes: 5,
                  dislikes: 10,
                },
                id: 'ef34f03d-c3ce-4979-a3d4-25e801b42294',
              },
            ],
          },
        });
        const subj = new BlogService(blogRepo, commentRepo);
        const ex: Blog = {
          principal: {
            record: {
              text: 'autem nihil nostrum',
              tags: ['tag1', 'tag2'],
            },
            id: 'e67c6ef1-151e-4eaf-aeb1-1a69ef83d56b',
          },
          comments: [
            {
              record: {
                text: 'L + Ratio',
                likes: 5,
                dislikes: 10,
              },
              id: 'ef34f03d-c3ce-4979-a3d4-25e801b42294',
            },
          ],
        };

        const act = await subj.get('e67c6ef1-151e-4eaf-aeb1-1a69ef83d56b');

        should.exist(act);
        act!.should.deep.equal(ex);
      });
    });

    describe('not exist', () => {
      it('should return null', async () => {
        const [blogRepo, commentRepo] = buildMock({});
        const subj = new BlogService(blogRepo, commentRepo);

        const act = await subj.get('e67c6ef1-151e-4eaf-aeb1-1a69ef83d56b');
        should.not.exist(act);
      });
    });
  });
});
