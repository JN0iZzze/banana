# Creator Structural Taxonomy

## Зачем этот документ

Это рабочий словарь для Creator.

Он нужен, чтобы:

- одинаково называть структурные сущности редактора;
- не путать JSON storage shape с UX-моделью редактора;
- понимать, что мы считаем `layout`, что считаем `organism`, а что остаётся `atom`;
- проектировать selection, inspector и structural actions без разъезда терминов.

## Главная позиция

JSON для нас не продуктовая модель мышления, а внутренний формат хранения и runtime-контракт рендера.

В UX Creator пользователь мыслит не полями JSON, а:

- слайдом;
- композицией;
- блоками;
- содержимым блока;
- действиями над блоком.

Поэтому таксономия ниже описывает **редакторскую объектную модель**, а не просто shape `JsonSlideDocument`.

## Слои модели

### 1. Document

`Document` — весь слайд целиком.

Это корень дерева. Он:

- хранит template-level выбор;
- содержит top-level wrapper fields (`theme`, `frame`, `content`, `backdrop`, `header`, `layout`, `cover`, `stack`);
- не является ни layout, ни organism в терминах atomic design.

Это просто корневой контейнер.

### 2. Template

`Template` — верхнеуровневый сценарий построения слайда.

В текущем контракте:

- `default`
- `textStack`
- `imageCover`

Template отвечает за то, **какой вообще тип дерева** лежит под корнем документа.

Важно:

- template — **не layout**;
- template — **не organism**;
- смена template почти всегда означает замену большого куска дерева, а не локальную настройку.

### 3. Layout

`Layout` — сущность, которая управляет **геометрией и размещением дочерних областей**.

Признаки layout:

- у него есть `type`;
- он раскладывает дочерние region/items по сцене;
- он отвечает за spans / columns / rows / gap / placement;
- его задача — композиция, а не смысловое содержимое.

Правило:

> Если объект в первую очередь отвечает за расположение дочерних блоков на сцене, мы считаем его layout.

### 4. Region wrapper

`Region` — это routing-обёртка, а не самостоятельный UX-объект.

Пример shape:

- `{ kind: "card", card: ... }`
- `{ kind: "quote", quote: ... }`
- `{ kind: "text", text: ... }`
- `{ kind: "layout", layout: ... }`

Region нужен для типизированного dispatch в runtime и editor tree, но сам по себе не должен становиться отдельной редакторской сущностью.

Правило:

> Region — это транспортный конверт для вложенного объекта, а не отдельный уровень atomic taxonomy.

### 5. Organism

`Organism` — самостоятельный смысловой блок слайда.

Признаки organism:

- у блока есть собственная задача в коммуникации слайда;
- блок можно осмысленно выбрать на сцене;
- блок имеет свой набор свойств;
- блок может содержать внутреннюю структуру;
- блок должен иметь собственный inspector или хотя бы собственный action scope.

Правило:

> Если объект можно воспринимать как отдельный блок композиции, который можно выбрать, настроить и потенциально трансформировать, это organism.

### 6. Molecule

`Molecule` — структурная часть organism-а.

Признаки molecule:

- у неё есть своя форма и порядок;
- она подчинена organism-у и не живёт как отдельный top-level блок;
- пользователь может захотеть добавлять, удалять, дублировать или переставлять такие элементы;
- molecule не должна определять глобальную геометрию слайда.

Правило:

> Если это повторяемая или составная часть organism-а, но не самостоятельный блок композиции слайда, это molecule.

### 7. Atom

`Atom` — минимальная leaf-сущность редактора.

Признаки atom:

- у неё нет значимой внутренней структуры для UI;
- редактирование atom — это изменение одного поля/значения;
- atom не раскладывает детей и не управляет составом.

Примеры:

- строка текста;
- enum;
- boolean flag;
- числовой параметр;
- asset reference;
- icon id;
- align/gap/tone/padding.

Правило:

> Если дальше дробить объект бессмысленно для UX, это atom.

## Важные разграничения

### Template != Layout

- `textStack` — template.
- `stackLayout` — layout.

Первый определяет форму всего документа, второй — композицию дочерних узлов внутри layout tree.

### Layout != Organism

`splitLayout`, `equalColumns`, `uniformGrid` и т.д. могут быть selectable, но это не делает их organism-ами.

Selectability не определяет категорию.

`Layout` — это геометрия.
`Organism` — это смысловой блок.

### Selectable != Organism

Некоторые selectable объекты нужны для editor UX, но не являются organism-ами в чистой taxonomy.

Например:

- `layout` — selectable, но это layout;
- `imageCoverBackground` — selectable, но это скорее structural surface, а не смысловой organism.

### Region != Organism

`region.kind` нужен для dispatch, но реальным объектом для редактора является то, что лежит внутри:

- `card`
- `quote`
- `text`
- nested `layout`

### Collection != Molecule автоматически

Массив сам по себе не категория.

Например:

- `card.items[]` — molecules;
- `headline.blocks[]` — molecules;
- `layout.items[]` у `equalColumns` — это дочерние layout children, а не просто “молекулы по факту массива”.

Смотрим не на то, что это массив, а на роль элементов в композиции.

## Decision rules для Creator

Чтобы новая сущность попала в taxonomy, задаём вопросы сверху вниз:

1. Это весь документ целиком?
   - Да -> `document`
2. Это верхнеуровневый сценарий документа?
   - Да -> `template`
3. Это объект, который управляет размещением дочерних областей?
   - Да -> `layout`
4. Это транспортный wrapper для dispatch?
   - Да -> `region wrapper`
5. Это самостоятельный смысловой блок слайда?
   - Да -> `organism`
6. Это повторяемая/вложенная структурная часть organism-а?
   - Да -> `molecule`
7. Иначе это leaf value / minimal property
   - `atom`

## Практический вывод для архитектуры

### Что должно быть selection-first

В первую очередь selection-driven inspector должен мыслить такими сущностями:

- `slide`
- `layout`
- `header`
- `card`
- `quote`
- `textRegion`
- `stack`
- `mediaGallery`
- `mediaItem`
- `imageCoverHeadline`
- `imageCoverRail`

То есть в основном layout-и и organism-ы.

### Что должно редактироваться как structural actions

Structural actions в первую очередь должны работать по:

- children layout-а;
- molecules внутри organism-а;
- replace/transform между совместимыми organism/layout-типами.

### Что не должно быть отдельной UX-моделью

Не надо делать продуктовым понятием:

- raw JSON path;
- `region` wrapper;
- служебные discriminator fields как user-facing concepts.

## Summary

В Creator мы считаем:

- `template` — сценарий документа;
- `layout` — геометрию;
- `organism` — самостоятельный смысловой блок;
- `molecule` — внутреннюю структурную часть блока;
- `atom` — минимальное leaf-значение.

Именно от этой классификации дальше должны зависеть:

- selection model;
- inspector scopes;
- mutation APIs;
- structural actions;
- replace/transform операции.
