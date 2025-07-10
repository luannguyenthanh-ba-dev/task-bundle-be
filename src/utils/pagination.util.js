const paginate = (page = '0', limit = '10') => {
  const pageNumber = typeof page === 'string' ? parseInt(page, 10) : page;
  const limitNumber = typeof limit === 'string' ? parseInt(limit, 10) : limit;
  return { p: pageNumber, l: limitNumber };
};

module.exports = { paginate };
