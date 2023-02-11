function PostImage({ PostPic }: any) {
  return (
    <div>
      <img src={PostPic} alt="user" loading="lazy" />
    </div>
  );
}

export default PostImage;
