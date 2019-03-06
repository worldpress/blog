import * as React from 'react';
import { Container } from 'react-grid-system';

import useBlogPosts from '../hooks/useBlogPosts';
import DefaultLayout from '../layouts/DefaultLayout';

interface IIndexPageProps {
  location: Location;
}

export default (props: IIndexPageProps) => {
  const { location } = props;
  const posts = useBlogPosts();

  return (
    <DefaultLayout location={location}>
      <Container>
        {posts.map(post => {
          const { title, body } = post;
          return (
            <div>
              <h3>{title}</h3>
            </div>
          );
        })}
      </Container>
    </DefaultLayout>
  );
};
