import Typography from 'typography';
// @ts-ignore
import Wordpress2016 from 'typography-theme-wordpress-2016';

// @ts-ignore
// tslint:disable-next-line:no-shadowed-variable
Wordpress2016.overrideThemeStyles = ({ rhythm }) => ({
  'body': {
    color: '#2e3444',
  },
  'h1, h2, h3, h4, h5, h6': {
    fontFamily: Wordpress2016.headerFontFamily.join(','),
    fontWeight: '400',
  },
  'a': {
    boxShadow: '0 1px 0 0 currentColor',
    color: '#dc001c',
    textDecoration: 'none',
  },
  'p': {
    lineHeight: rhythm(9 / 10),
  },
  'li': {
    lineHeight: rhythm(9 / 10),
  },
  'blockquote': {
    fontSize: '1rem',
    marginRight: 0,
    marginTop: rhythm(1),
    paddingTop: rhythm(1 / 4),
    paddingBottom: rhythm(1 / 4),
    background: '#fafafa',
    borderLeft: `${rhythm(1 / 8)} solid #dc001c`,
  },
});

Wordpress2016.headerFontFamily =  ['Georgia', 'serif'];
Wordpress2016.bodyFontFamily =  ['Georgia', 'serif'];

delete Wordpress2016.googleFonts;

const typography = new Typography(Wordpress2016);

// Hot reload typography in development.
if (process.env.NODE_ENV !== 'production') {
  typography.injectStyles();
}

const { rhythm, scale } = typography;
export { rhythm, scale, typography as default };
