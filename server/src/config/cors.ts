const corsOptions = {
  origin: [`${process.env.CLIENT_DOMAIN}`],
  credentials: true,
};

export default corsOptions;
