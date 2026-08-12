const categories = {
  popular: {
    title: "Popular",
    endpoint: "/movie/popular?language=en-US&page=1",
  },
  "top-rated": {
    title: "Top Rated",
    endpoint: "/movie/top_rated?language=en-US&page=1",
  },
  bollywood: {
    title: "Bollywood",
    endpoint:
      "/discover/movie?with_original_language=hi&sort_by=popularity.desc",
  },
  hollywood: {
    title: "Hollywood",
    endpoint: "/discover/movie?with_original_language=en&sort_by=revenue.desc",
  },
  comedy: {
    title: "Comedy",
    endpoint: "/discover/movie?with_genres=35&sort_by=popularity.desc&page=1",
  },
  action: {
    title: "Action",
    endpoint: "/discover/movie?with_genres=28&sort_by=popularity.desc&page=1",
  },
  animation: {
    title: "Animation",
    endpoint: "/discover/movie?with_genres=16&sort_by=popularity.desc&page=1",
  },
};

export default categories
