
<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![CircleCI][circleci-shield]][circleci-url]
[![CodeCov][codecov-shield]][codecov-url]
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![Version][version-shield]][version-url]
[![MIT License][license-shield]][license-url]



<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/SurveyMonkey/graphql-introfields">
  </a>

  <h3 align="center">GraphQL Introfields</h3>

  <p align="center">
    🏑 GraphQL resolver utilities based on fields introspection.
    <br />
    <a href="https://github.com/SurveyMonkey/graphql-introfields/issues">Report Bug</a>
    ·
    <a href="https://github.com/SurveyMonkey/graphql-introfields/issues">Request Feature</a>
  </p>
</p>


<!-- TABLE OF CONTENTS -->
## Table of Contents

- [Table of Contents](#table-of-contents)
- [About The Project](#about-the-project)
  - [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Basic Example](#basic-example)
    - [`resolveIDFieldFromRoot`](#resolveidfieldfromroot)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)
- [Acknowledgements](#acknowledgements)



<!-- ABOUT THE PROJECT -->
## About The Project

This library provides utilities to facilitate the resolution of GraphQL based on which fields are requested.

### Built With
* [Typescript](https://www.typescriptlang.org/)
* [GraphQL](https://graphql.org)
* [Jest](https://jestjs.io)


<!-- GETTING STARTED -->
## Getting Started

### Installation

```
npm install graphql-introfields
```

<!-- USAGE EXAMPLES -->
### Usage

#### Basic Example

With the following schema:
```graphql
type Employee {
  id: ID!
  name: String!
}

type VideoStore {
  id: ID!
  employees: [Employee!]!
  manager: Employee!
}

type Query {
  videostore: VideoStore
}

schema {
  query: Query
}
```

And with the following resolvers:

```javascript
import { resolveBasedOnFields } from 'graphql-introfields';

const resolvers = {
  Query: {
    videostore: getVideoStoreData,
  },
  VideoStore: {
    manager: resolveBasedOnFields((fields) => {
      // if you know that only the `id` field is asked for, and it's present on the root, you can prevent
      // unnecessary resolution of the manager field (which may be an over-the-network request).
      if (fields.length === 1 && fields[0].name.value === 'id') {
        return (root, _args, _ctx, _info) => ({ id: root['managerId'] });
      }
      return (root, _args, _ctx, _info) => getEmployeeById(root.managerId);
    }),
  },
}
```

The following query doesn't actually call  `getEmployeeById`:

```graphql
query {
  videostore {
    manager {
      id
    }
  }
}
```

#### `resolveIDFieldFromRoot`

The above use-case is actually available as a provided utility.

```js
import { resolveIDFieldFromRoot } from 'graphql-introfields';
const resolvers = {
  videostore: {
    manager: resolveIDFieldFromRoot(
      'managerId',
      (root) => getEmployeeById(root.managerId)
    )
  }
}
```

<!-- ROADMAP -->
## Roadmap

See the [open issues](https://github.com/SurveyMonkey/graphql-introfields/issues) for a list of proposed features (and known issues).


<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.


<!-- CONTACT -->
## Contact

Maintainer: Joel Marcotte (Github [@joual](https://github.com/joual))

Project Link: [https://github.com/SurveyMonkey/graphql-introfields](https://github.com/SurveyMonkey/graphql-introfields)


<!-- ACKNOWLEDGEMENTS -->
## Acknowledgements

* [GraphQL-Tools](https://github.com/apollographql/graphql-tools)
* [GraphQL-JS](https://github.com/graphql/graphql-js)


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/SurveyMonkey/graphql-introfields.svg?style=flat-square
[contributors-url]: https://github.com/SurveyMonkey/graphql-introfields/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/SurveyMonkey/graphql-introfields.svg?style=flat-square
[forks-url]: https://github.com/SurveyMonkey/graphql-introfields/network/members
[stars-shield]: https://img.shields.io/github/stars/SurveyMonkey/graphql-introfields.svg?style=flat-square
[stars-url]: https://github.com/SurveyMonkey/graphql-introfields/stargazers
[version-url]:https://www.npmjs.com/package/graphql-introfields
[version-shield]:https://img.shields.io/npm/v/graphql-introfields.svg?style=flat-square
[issues-shield]: https://img.shields.io/github/issues/SurveyMonkey/graphql-introfields.svg?style=flat-square
[issues-url]: https://github.com/SurveyMonkey/graphql-introfields/issues
[license-shield]: https://img.shields.io/github/license/SurveyMonkey/graphql-introfields.svg?style=flat-square
[license-url]: https://github.com/SurveyMonkey/graphql-introfields/blob/master/LICENSE.txt
[circleci-shield]: https://circleci.com/gh/SurveyMonkey/graphql-introfields.svg?style=shield
[circleci-url]: https://app.circleci.com/pipelines/github/SurveyMonkey/graphql-introfields
[codecov-shield]: https://codecov.io/gh/SurveyMonkey/graphql-introfields/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/SurveyMonkey/graphql-introfields