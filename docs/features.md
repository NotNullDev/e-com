# Table of contents

- [Table of contents](#table-of-contents)
- [Overview](#overview)
  - [Pages](#pages)
  - [Filtering](#filtering)
  - [Sorting](#sorting)
  - [3rd party API](#3rd-party-api)
  - [TODO](#todo)
  - [Optimalization](#optimalization)
  - [Bugs](#bugs)
  - [API KEY](#api-key)
    - [Md playground](#md-playground)
  - [Example table](#example-table)


# Overview

## Pages

Design file: [Excalidraw file](pages.excalidraw)

- [x] Products page (main page)
- [x] Product details page
- [x] Cart page

## Filtering

- [x] Product name
- [x] Product price
- [x] Product category
- [x] Rating

## Sorting

- [x] Price

## 3rd party API
- [x] Stripe

## TODO
- [x] remove items from cart
- [ ] redesign cart page
- [ ] fix images background position
- [ ] deploy new version with file server
- [ ] edit product page
- [ ] merge product store and product search store
- [ ] make all stores use immer (remove all setters)

## Optimalization
- [ ] Rerendering optimization

## Bugs
- [x] Fix bug with cart items count in header (it's not updating when you remove item from cart)
- [x] State is not reseted and if search input is empty
- [ ] Invalid search state (search and filtering are desynchronized)
- [ ] Details page wrong category name

## API KEY
```bash
gcloud auth print-access-token
```
### Md playground

```json
{
    "haha": "hehe"
}
```

haha :joy:

## Example table
| h1                  | h2   |
| ------------------- | ---- |
| haha                | hehe |
| xdddfdsfsdafasfadsf | asds |


[Excalidraw file](pages.excalidraw)
![Image](stats.excalidraw.png)
![apple image](apple.jpeg)

<p align="center">
  <img width="460" height="300" src="apple.jpeg">
</p>