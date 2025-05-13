import { Button } from '@strapi/design-system';

const CollectionTypePage = () => {
  const handlePreviewClick = () => {
    const url = `&publicationState=preview&filters[publishedAt][$null]=true`;
    window.location.href += url;
  };

  return (
    <>
      <Button color="primary" onClick={handlePreviewClick}>
       Show Unpublished
      </Button>
    </>
  );
};

export default CollectionTypePage;
