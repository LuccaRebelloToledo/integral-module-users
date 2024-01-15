import cookieParser from 'cookie-parser';

const cookieParserConfig = cookieParser(process.env.COOKIE_SECRET!);

export default cookieParserConfig;
