# Welcome to Alapa!

Alapa is a cutting-edge web development framework designed to revolutionize the way developers build modern web applications. With a focus on simplicity, flexibility, and performance, Alapa provides powerful features like React-like components, intuitive routing, and modular architecture to create scalable and maintainable applications effortlessly.

By seamlessly integrating robust tools such as resourceful routing, built-in authentication, and a customizable template engine, Alapa empowers developers to focus on writing clean and efficient code. Whether you're handling complex routing scenarios or creating dynamic UI components, Alapa provides everything you need right out of the box.

Spearheaded by Michael Odeh, this framework is in active development and driven by community input. The goal is to create a framework that not only enhances your development workflow but also adapts to modern practices. Alapa's simple, developer-friendly design makes it the perfect choice for developers of all skill levels, from those building small projects to those working on large-scale enterprise solutions.

Join us on this journey and contribute to the future of web development with Alapa!

## Table of Contents

- [Why Alapa?](#why-alapa)

  - [React-like Components](#react-like-components)
  - [Seamless Routing](#seamless-routing)
  - [Modular Architecture](#modular-architecture)
  - [Developer-Friendly](#developer-friendly)
  - [Focus on Modern Development Practices](#focus-on-modern-development-practices)
  - [Built-in Authentication](#built-in-authentication)
  - [Customization](#customization)
  - [Community-driven Development](#community-driven-development)

- [Getting Started](#getting-started)
- [Roadmap](#roadmap)

- [Sample Code](#sample-code)

  - [Routing](#routing)
  - [Middleware](#middleware)
  - [Named Routes](#named-routes)
  - [Resourceful Routing](#resourceful-routing)
  - [Model](#model)
  - [Authentication](#authentication)

- [Template Engine](#template-engine)

  - [Expressions](#expressions)
  - [Outputting Variables](#outputting-variables)
  - [Components](#components)
  - [Sample Import](#sample-import)
  - [Include and Require](#include-and-require)

- [Contributing](#contributing)

- [Sponsorship](#sponsorship)

  - [Sponsorship Benefits](#sponsorship-benefits)

- [License](#license)

## Why Alapa?

In the fast-evolving world of web development, developers need frameworks that are not only powerful but also adaptable to modern practices. Alapa is built to be that framework — one that simplifies development while providing flexibility and scalability.

### **React-like Components**

Alapa adopts a component-based approach, allowing you to build reusable, modular components similar to React. This means you can break down your application into smaller, manageable pieces that enhance reusability and maintainability.

### **Seamless Routing**

Routing is one of the key features of any web framework, and Alapa makes it incredibly easy. With a robust yet simple routing system, you can quickly define your routes, handle requests, and organize your application’s navigation.

### **Modular Architecture**

Modularity lies at the heart of Alapa. You can easily import styles, scripts, and components into your project, giving you the flexibility to manage dependencies and grow your application organically.

### **Developer-Friendly**

Alapa is built with developers in mind. Its intuitive API, detailed documentation, and clear examples make it easy to get started, while its rich feature set ensures it scales with your application's growth.

### **Focus on Modern Development Practices**

Alapa isn’t just about getting things done fast — it’s about getting them done right. Built-in support for modern development practices like template engines, resourceful routing, and API-first architecture ensures that your application is robust and future-proof.

### **Built-in Authentication**

With Alapa, authentication is not an afterthought. It includes a powerful built-in authentication system, enabling secure and efficient handling of user logins, session management, and access control right out of the box.

### **Customization**

Flexibility is key in today's fast-paced development environment. Alapa allows you to tailor your application to suit your needs, whether through custom components, third-party integrations, or a customizable template engine.

### **Community-driven Development**

Alapa thrives on the input and collaboration of its growing developer community. By offering feedback, opening issues, or contributing code, developers are actively helping to shape the future of Alapa.

---

Alapa is designed for developers who are looking for a modern, intuitive, and flexible framework to build web applications. Whether you're working on a small project or a large-scale enterprise application, Alapa equips you with the tools you need to succeed.

## Getting Started

Follow these steps to get started with Alapa using the [create-alapa-app](https://github.com/alapajs/create-alapa-app) command line tool.

1. ### Install the Alapa starter application:

```bash
npx create-alapa-app my-alapa-app
```

2. ### Navigate to the project directory:

```bash
cd my-alapa-app
```

3. ### Start the development server:

```bash
npm run dev
```

4. Open http://localhost:3000 in your browser to view the application.

## Roadmap

For an overview of Alapa's development and community engagement strategy, please refer to our [Roadmap](roadmap.md) section.
<br/>This roadmap outlines our goals, key milestones, and future directions from Q4 2024 through 2027 and beyond.
<br>Stay updated on our progress and how you can get involved in shaping the future of Alapa!

## Sample Code

### Routing

Alapa features a simple and intuitive routing system. Here's an example of how to define routes:

```ts
import { Router, Request, Response } from "alapa";

const router = new Router();

router.get("/", (req: Request, res: Response) => {
  res.send("Welcome to my site!");
});
export default router;
```

POST, PUT, PATCH, DELETE,OPTIONS and other methods are also supported.

### Middleware

This middleware handles requests to the `/dashboard` route.

```ts
import { Router, Request, Response NextFunction } from "alapa";

const router = new Router();
router.use("/dashboard", (req: Request, res: Response, next: NextFunction)=>{
   // Add your middleware logic here (e.g., authentication, logging)

  next(); // Proceed to the next middleware or route handler
});
export default router;
```

### Named Routes

You can also assign names to routes for easy reference:

```ts
import { Router } from "alapa";

const router = new Router();

router.all("/register", register).name("register");

export default router;
```

Use the route name in your templates like this:

```tsx
<a href="{{ route('register') }}">Register</a>
<!-- OR -->
<a href="{{ url('register') }}">Register</a>
```

### Resourceful Routing

Alapa supports resourceful routing, which maps common CRUD operations to routes:

| Verb      | URL             | Method  | Route Name    |
| --------- | --------------- | ------- | ------------- |
| GET       | books           | index   | books.index   |
| GET       | books/create    | create  | books.create  |
| POST      | books           | store   | books.store   |
| GET       | books/{id}      | show    | books.show    |
| GET       | books/{id}/edit | edit    | books.edit    |
| PUT/PATCH | books/{id}      | update  | books.update  |
| DELETE    | books/{id}      | destroy | books.destroy |

Define your controller class and include methods for each resourceful operation:

```ts
import { ResourcefulController, Request, Response } from "alapa";

export class BookController implements ResourcefulController {
  async index(req: Request, res: Response) {
    const books = await Books.find();
    res.render("books.index", { books });
  }

  async show(req: Request, res: Response) {
    const book = await Books.findOneBy({ id: req.params.id });
    res.render("books.show", { book });
  }

  create(req: Request, res: Response) {
    res.render("books.create");
  }

  async store(req: Request, res: Response) {
    const book = new Books();
    book.title = req.body.title;
    book.author = req.body.author;
    book.year = req.body.year;
    book.description = req.body.description;
    await book.save();
    res.flash("success", "Book created successfully");
    res.redirect("/books");
  }

  async edit(req: Request, res: Response) {
    const book = await Books.findOneBy({ id: req.params.id });
    res.render("books.edit", { book });
  }

  async update(req: Request, res: Response) {
    const book = await Books.findOneBy({ id: req.params.id });
    if (book) {
      book.title = req.body.title;
      book.author = req.body.author;
      book.year = req.body.year;
      book.description = req.body.description;
      await book.save();
      res.flash("success", "Book updated successfully");
    } else {
      res.flash("error", "Book not found");
    }
    res.redirect(`/books/${book.id}/edit`);
  }

  async destroy(req: Request, res: Response) {
    const book = await Books.findOneBy({ id: req.params.id });
    if (book) {
      book.destroy();
      res.flash("success", "Book deleted successfully");
    } else {
      res.flash("error", "Book not found");
    }
    res.redirect("/books");
  }
}
```

Register the resourceful route:

```ts
import { Router } from "alapa";
import { BookController } from "./books/controller";

const routes = new Router();
routes.resource("/books", BookController);

export default routes;
```

### Model

Models in Alapa interact with your database to manage and retrieve data.

Here's a simple `Users` model:

`models/users.ts`

```ts
import { AuthenticatableModel, TableModel } from "alapa";

@TableModel()
export class Users extends AuthenticatableModel {}
```

> [!Note]
> The Users model extends AuthenticatableModel, which is used for authentication purposes.
> And @TableModel() makes the model a database table.

#### Defining a Model with Relation

In this section, we will explore how to create a model that incorporates relationships with other models. By using decorators such as `ManyToOne` and `JoinColumn` decorators, we can establish connections between different entities, enabling efficient data management and retrieval in our application. This approach helps to maintain data integrity and allows for more complex queries and operations.

Here is the code sample:

`models/books.ts`

```ts
import { Users } from "./user";
import {
  Model,
  ManyToOne,
  JoinColumn,
  Column,
  NullColumn,
  NumericColumn,
  PrimaryKeyColumn,
  TableModel,
  TextColumn,
} from "alapa";

@TableModel()
export class Books extends Model {
  @PrimaryKeyColumn()
  id: number;

  @Column()
  title: string;

  @JoinColumn({ name: "user" })
  @ManyToOne((type) => Users, { onDelete: "CASCADE" })
  user: Users;

  @NullColumn()
  author: string;

  @NumericColumn()
  year: number;

  @TextColumn()
  description: string;
}
```

#### Using the Model

Create a new record

```ts
import { Books } from "models/books";
import { Users } from "models/users";

const user = Users.findOneBy({ id: 1 });

if (!user) return;

book.title = req.body.title;
book.author = req.body.author;
book.year = req.body.year;
book.description = req.body.description;
book.user = user;

await book.save(); // save to database
```

See [Resourceful Routing](#resourceful-routing) for more examples of how to perform CRUD operations.

### Authentication

Alapa comes with a built-in authentication mechanism for web and API endpoints.

Example Usage:

```ts
import { Auth } from "alapa";

Auth.attempt("username", "password");
```

The `attempt` method returns an object containing `success`, `reason`, `errorMessage`, and `user`. It accepts an optional third argument called `when`. The `WhenCallback`, as the name suggests, is a list of functions that take `user` as an argument and also return `success`, `reason`, `errorMessage`, and `user`. The `attempt` method terminates if any of the functions return `success` as `false`.

#### Auth.login

To log in a user, you can use:

```ts
import { Auth } from "alapa";
Auth.login(req, res, user);
// OR
req.login(user);
```

The `login` method returns an authentication result containing the `user`, `success`, `message`, and the `destination` (URL) to redirect the user to; the default is the dashboard.

The `login` method also has an optional parameter called `rememberMe`, which is a boolean argument that indicates whether the login should remember the user. If `rememberMe` is `true`, the user ID, referred to as `user`, and the encrypted token, called `token`, will be saved to the cookie.

#### Auth.logout

To log out a user, use:

```ts
import { Auth } from "alapa";
Auth.logout();
```

The `logout` method will destroy the session of the current user.

## Template Engine

Alapa's template engine allows you to create dynamic HTML files using its unique syntax. The default file extension is .html.

### Expressions

Expressions are enclosed within `{%` and `%}`:

```ts
{% console.log("Hello, World!") %}
```

Output: Hello, World!

> [!NOTE]
> Expression should be valid javascript code

### Outputting Variables

Variables are enclosed within {{ and }}:

```html
<p>{{ myVariable }}</p>
```

To output raw HTML, use triple braces: `{{{ myVariable }}}`.

### Components

Components behave closely like React components and can be imported in your templates.

`components/layout.html`

```tsx
{% import 'components/navbar.html' %}

<component default Layout props>
  <!DOCTYPE html>

  <html lang="en">
    <head>
      <meta charset="UTF-8" />

      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      <title>My Alapa App</title>

      <link rel="stylesheet" href="{{static('css/app.css')}}" />
    </head>

    <body class="bg-gray-100 dark:bg-gray-900dark:text-gray-300">
      <!-- you can also use nested component -->
      <x:NavBar />
      {{props.content}}
    </body>

    <script src="{{static('js/app.js')}}"></script>
  </html>
</component>
```

Using the Layout Component.

```tsx
{% import "components/layout.html" %}
<X:Layout>
 <!-- The content of the component goes here -->
  <div>
    <p>Hello, World</p>
  </div>
</X:Layout>
```

Components behave like React component functions and have their own local scope. The following variables are available in the local scope of the component by default:

#### **props**

Contains the properties of the component.

##### Example:

Creating the component

```tsx
<component button props>
    <button class="btn" type="{{ props.type }}">
      {{{ props.content }}}
    </button>
</component>
```

Using the Component

```tsx
{% import {button} from '/components/button'; %}
<x:button type="button">My Button</x:button>
```

Output will be:

`<button class="btn" type="button">My Button</button>`

#### **content**

Contains the content of the component and is the same as `props.content`

##### Example:

Creating the component

```tsx
<component default button props>
  <button class="btn" type="{{ props.type }}">
    {{{ content }}}
  </button>
</component>
```

Using the component

```tsx
{% import '/components/button'; %}
<x:button type="button">My Button</x:button>
```

Output will be:

`<button class="btn" type="button">My Button</button>`

#### **attributes**

Contains the attributes of the component and is the same as `props.attributes`

##### Example:

Creating the component

```tsx
<component default button props>
  <button class="btn" type="{{ attributes.type }}">
    {{{ content }}}
  </button>
</component>
```

Using the component

```tsx
{% import button from '/components/button'; %}
<x:button type="button">My Button</x:button>
```

Output will be:

`<button class="btn" type="button">My Button</button>`

#### **stringAttributes**

Contains the raw string attributes of the component and is the same as `props.stringAttributes`

##### Example:

Creating the component

```tsx
<component default button props>
    <button class="btn" {{{ props.stringAttributes }}} >
      {{{ content }}}
    </button>
</component>
```

Using the component

```tsx
{% import button from '/components/button'; %}
<x:button id="myButton" type="button">My Button</x:button>
```

Output will be:

`<button class="btn" id="myButton" type="button">My Button</button>`

#### **props.{attributeName}**

Contains the **value** of **props.attributeName** of the component.

##### Example:

Creating the component

```tsx
<component default button props>
  <button class="btn" type="{{ props.type }}">
    {{{ content }}}
  </button>
</component>
```

Using the component

```tsx
{% import button from '/components/button'; %}
<x:button type="button">My Button</x:button>
```

Output will be:

`<button class="btn" type="button">My Button</button>`

#### Customizing Component's Properties Identifier

You can also change `props` to any valid identifier, and you don't always need to include `props` if you are not changing the name, as the default name will automatically be set to `props`.

##### Example:

Creating the component

```tsx
<component default button myProps>
 <button> {{{ myProps.content }}}</button>
</component>
```

```tsx
<x:button content="<strong>My Button</strong>" />
```

> [!Note]
> The `content` property is used as an HTML attribute, and the `x:button` is used as an inline element.

### Sample Import

These are some examples of import statements supported by the Alapa Component.

```js
{%
import { Button, Input } from 'modules/form';
import Default { OtherComponent } from 'component/path';

// Aliases are also supported
import { Button as MyButton } from 'form';

// these will import the default component
import DefaultMember from 'components/default-member.component';
import 'component/button';
import("component/button")

// import the default component as alias
import DefaultMember as MyDefaultComponent from 'components/default-member.component';
%}
```

### Include and Require

Alapa has `include` and `require` statements that copy templates into another template and render them as a single template, which happens only at runtime. <br/>
The `require` and `include` statements essentially do the same thing, except that the require statement will throw an exception if the template is not found.

Below are sample codes for the include and require statements.

```php
{%
include 'my-template.html';
include 'my-template'; // without extensions
include ('my-template') // enclosed in parentheses
require 'my-template.html';
require 'my-template';
require ('my-template')
%}
```

---

## Contributing

We welcome contributions! Join us on [discord](https://discord.com/invite/nPqTeJ8SgK) to collaborate, or open issues for feature requests or bug reports.

## Sponsorship

If you share the vision of Alapa and wish to support its development, consider becoming a sponsor. Your contribution helps accelerate development, improve documentation, and enhance the overall quality.

For more information, contact [michael4dominion1@gmail.com](mailto::michael4dominion1@gmail.com).

### Sponsorship Benefits

- Visibility for your brand in Alapa's documentation and promotional materials.
- Acknowledgment in release notes and updates.
- Influence over future feature prioritization.

## License

Alapa is licensed under the MIT License. See the LICENSE file for more details.

Join me on this journey, and let’s create something amazing together!

Your feedback and support are invaluable as we build Alapa into a premier web development tool.

— Michael Odeh
