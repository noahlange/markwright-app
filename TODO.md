# todo

## Basic functionality

- [ ] filename for sass input (currently displaying `stdin`)
- [ ] on metadata change, styles must be regenerated (margins, &c.)
- [ ] duplicate `.mw` extension in close dialog?

## Upcoming Features

### Multi-file support

The ability to use >1 file per content type would be a good feature addition.
Perhaps a tree-style "file" explorer on the left with three directories
(content, styles, maybe assets?) would be a good fit?

Downside is that we'll likely need to make the file format an archive instead of
a JSON file—especially if assets enter the picture. And it'll require
restructuring the project format, etc.
