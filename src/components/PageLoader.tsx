const PageLoader = () => (
  <div className="flex min-h-[50vh] items-center justify-center" role="status" aria-label="Loading content">
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
    <span className="sr-only">Loading...</span>
  </div>
);

export default PageLoader;
