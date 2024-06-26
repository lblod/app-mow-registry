# app-mow-registry

## 1.2.7

### Patch Changes

- [`6b87aa3`](https://github.com/lblod/app-mow-registry/commit/6b87aa3b03afaf720f79c1190aecf22d87b98ca2) Thanks [@elpoelma](https://github.com/elpoelma)! - Update frontend to version 1.4.5

- [#77](https://github.com/lblod/app-mow-registry/pull/77) [`f4d1a93`](https://github.com/lblod/app-mow-registry/commit/f4d1a932ba4bb4d38e144b0717eb8c1fc01b911b) Thanks [@elpoelma](https://github.com/elpoelma)! - Add hacky workaround to ensure road-marking and traffic-light concepts can be correctly consumed:
  - Addition of a migration which adds default zonalities to traffic-light and road-marking concepts
  - Add `zonality` relationship to traffic-light and road-marking concepts in JSON-API definitions

## 1.2.6

### Patch Changes

- [`4e11409`](https://github.com/lblod/app-mow-registry/commit/4e114094277fa4722e599f2d2fdccce4d6aca81c) Thanks [@elpoelma](https://github.com/elpoelma)! - Update frontend to version 1.4.4

## 1.2.5

### Patch Changes

- [#76](https://github.com/lblod/app-mow-registry/pull/76) [`60713e6`](https://github.com/lblod/app-mow-registry/commit/60713e65ecedc84e36a547758ce10e471a769d42) Thanks [@elpoelma](https://github.com/elpoelma)! - Add migration to fill in missing zonalities of road-signs and traffic-measures

- [#76](https://github.com/lblod/app-mow-registry/pull/76) [`4786227`](https://github.com/lblod/app-mow-registry/commit/478622758647fae49d6fa2e82d81ee00cd26a0ad) Thanks [@elpoelma](https://github.com/elpoelma)! - Add migration to fix the zonality uri used for non-zonal road-signs and traffic-measures

## 1.2.4

### Patch Changes

- [`54094a5`](https://github.com/lblod/app-mow-registry/commit/54094a5c19dae99ea495f5d0a8c88b20e08d9eaa) Thanks [@elpoelma](https://github.com/elpoelma)! - Update frontend to version 1.4.3

- [#74](https://github.com/lblod/app-mow-registry/pull/74) [`8462f18`](https://github.com/lblod/app-mow-registry/commit/8462f1862f62e90e8749b1d951e97cb453d3ddb3) Thanks [@elpoelma](https://github.com/elpoelma)! - Drop resource relationships with unresolvable target

## 1.2.3

### Patch Changes

- [#72](https://github.com/lblod/app-mow-registry/pull/72) [`353fe47`](https://github.com/lblod/app-mow-registry/commit/353fe47a606dfd6c443bdd0ee74eb020d10232bf) Thanks [@elpoelma](https://github.com/elpoelma)! - Update frontend to 1.4.1

## 1.2.2 (2023-09-21)

### Patch Changes

- bump identifier to 1.10.1

## 1.2.1

### Patch Changes

- [`361545b`](https://github.com/lblod/app-mow-registry/commit/361545b467f62afe7c148963b6fb90ef991bdb43) Thanks [@abeforgit](https://github.com/abeforgit)! - switch to changesets for changelog management

## 1.2.0 (2023-09-19)

#### :house: Internal

- [#71](https://github.com/lblod/app-mow-registry/pull/71) Update frontend to 1.4.0 ([@elpoelma](https://github.com/elpoelma))

#### Committers: 1

- Elena Poelman ([@elpoelma](https://github.com/elpoelma))

## 1.1.3 (2023-09-01)

#### :house: Internal

- [#69](https://github.com/lblod/app-mow-registry/pull/69) chore(frontend): bump to [v1.3.1](https://github.com/lblod/frontend-mow-registry/releases/tag/1.3.1) ([@abeforgit](https://github.com/abeforgit))

#### Committers: 1

- Arne Bertrand ([@abeforgit](https://github.com/abeforgit))

## 1.1.2 (2023-06-02)

#### :house: Internal

- [#68](https://github.com/lblod/app-mow-registry/pull/68) Update the fix annotation service ([@lagartoverde](https://github.com/lagartoverde))

#### Committers: 1

- Oscar Rodriguez Villalobos ([@lagartoverde](https://github.com/lagartoverde))

## 1.1.1 (2023-05-31)

#### :house: Internal

- [#67](https://github.com/lblod/app-mow-registry/pull/67) update mu-cl-resources ([@lagartoverde](https://github.com/lagartoverde))

#### Committers: 1

- Oscar Rodriguez Villalobos ([@lagartoverde](https://github.com/lagartoverde))

## 1.1.0 (2023-05-31)

#### :rocket: Enhancement

- [#63](https://github.com/lblod/app-mow-registry/pull/63) add cache to all resources ([@lagartoverde](https://github.com/lagartoverde))

#### :bug: Bug Fix

- [#65](https://github.com/lblod/app-mow-registry/pull/65) increase default pagination limit ([@abeforgit](https://github.com/abeforgit))

#### :house: Internal

- [#66](https://github.com/lblod/app-mow-registry/pull/66) Bump frontend to 1.1.0 ([@lagartoverde](https://github.com/lagartoverde))

#### Committers: 2

- Arne Bertrand ([@abeforgit](https://github.com/abeforgit))
- Oscar Rodriguez Villalobos ([@lagartoverde](https://github.com/lagartoverde))

## 1.0.1 (2023-03-13)

#### :house: Internal

- [#62](https://github.com/lblod/app-mow-registry/pull/62) Update frontend to 1.0.3 ([@elpoelma](https://github.com/elpoelma))

#### Committers: 1

- Elena Poelman ([@elpoelma](https://github.com/elpoelma))

## 1.0.0 (2023-03-10)

#### :house: Internal

- [#61](https://github.com/lblod/app-mow-registry/pull/61) chore(frontend): bump frontend to v1.0.0 ([@abeforgit](https://github.com/abeforgit))

#### Committers: 1

- Arne Bertrand ([@abeforgit](https://github.com/abeforgit))

## 0.5.6

#### :house: Internal

- [#60](https://github.com/lblod/app-mow-registry/pull/60) Ensure required services restart automatically ([@elpoelma](https://github.com/elpoelma))

#### Committers: 1

- Elena Poelman ([@elpoelma](https://github.com/elpoelma))

## 0.5.1-2 (2023-03-09)

#### :house: Internal

- [#60](https://github.com/lblod/app-mow-registry/pull/60) Ensure required services restart automatically ([@elpoelma](https://github.com/elpoelma))

#### Committers: 1

- Elena Poelman ([@elpoelma](https://github.com/elpoelma))

## 0.5.5 (2023-01-24)

#### :house: Internal

- [#58](https://github.com/lblod/app-mow-registry/pull/58) Update frontend to 0.16.2 ([@elpoelma](https://github.com/elpoelma))

#### Committers: 1

- Elena Poelman ([@elpoelma](https://github.com/elpoelma))

## 0.5.1-1 (2023-01-24)

#### :bug: Bug Fix

- [#59](https://github.com/lblod/app-mow-registry/pull/59) Hotfix: update frontend to 0.14.2 ([@elpoelma](https://github.com/elpoelma))

#### Committers: 1

- Elena Poelman ([@elpoelma](https://github.com/elpoelma))

## 0.5.4 (2022-11-18)

#### :house: Internal

- [#57](https://github.com/lblod/app-mow-registry/pull/57) Bump frontend to 0.16.1 ([@elpoelma](https://github.com/elpoelma))

#### Committers: 1

- Elena Poelman ([@elpoelma](https://github.com/elpoelma))

## 0.5.3 (2022-11-07)

#### :house: Internal

- [#56](https://github.com/lblod/app-mow-registry/pull/56) chore(deps): bump frontend to v0.16.0 ([@abeforgit](https://github.com/abeforgit))

#### Committers: 1

- Arne Bertrand ([@abeforgit](https://github.com/abeforgit))

## 0.5.2 (2022-11-07)

#### :bug: Bug Fix

- [#55](https://github.com/lblod/app-mow-registry/pull/55) Use correctly cased dateTime datatypes ([@MikiDi](https://github.com/MikiDi))

#### Committers: 1

- Michaël Dierick ([@MikiDi](https://github.com/MikiDi))

## 0.5.1 (2022-07-08)

#### :bug: Bug Fix

- [#54](https://github.com/lblod/app-mow-registry/pull/54) :cloud: Upgrade frontend to 0.14.1 ([@nvdk](https://github.com/nvdk))

#### Committers: 1

- Niels V ([@nvdk](https://github.com/nvdk))

## 0.5.0 (2022-06-17)

#### :rocket: Enhancement

- [#53](https://github.com/lblod/app-mow-registry/pull/53) use varnish to cache queries ([@nvdk](https://github.com/nvdk))

#### Committers: 1

- Niels V ([@nvdk](https://github.com/nvdk))

## 0.4.0 (2022-03-25)

#### :rocket: Enhancement

- [#52](https://github.com/lblod/app-mow-registry/pull/52) Added location codelists migration ([@lagartoverde](https://github.com/lagartoverde))

- bump mow registry frontend to 0.14.0
- enable all relations: signs, marks and lights

## 0.3.0 (2022-01-26)

#### :rocket: Enhancement

- [#51](https://github.com/lblod/app-mow-registry/pull/51) added temporal signage selector ([@Asergey91](https://github.com/Asergey91))

#### Committers: 1

- Sergey Andreev ([@Asergey91](https://github.com/Asergey91))

## 0.1.0 (2022-01-20)

#### :rocket: Enhancement

- [#49](https://github.com/lblod/app-mow-registry/pull/49) Chore/setup acmidm ([@nvdk](https://github.com/nvdk))
- [#48](https://github.com/lblod/app-mow-registry/pull/48) Zonality migrations and relationships ([@Asergey91](https://github.com/Asergey91))
- [#44](https://github.com/lblod/app-mow-registry/pull/44) Internal/rdfa anotate ([@lagartoverde](https://github.com/lagartoverde))
- [#43](https://github.com/lblod/app-mow-registry/pull/43) Add concept scheme model configuration ([@claire-lovisa](https://github.com/claire-lovisa))
- [#41](https://github.com/lblod/app-mow-registry/pull/41) Feature/codelist UI ([@Asergey91](https://github.com/Asergey91))
- [#37](https://github.com/lblod/app-mow-registry/pull/37) imported codelists from provided spreadsheet ([@Asergey91](https://github.com/Asergey91))
- [#39](https://github.com/lblod/app-mow-registry/pull/39) removed measures and only add instructions on signs for now ([@nvdk](https://github.com/nvdk))
- [#36](https://github.com/lblod/app-mow-registry/pull/36) added ability to verify content ([@Asergey91](https://github.com/Asergey91))
- [#34](https://github.com/lblod/app-mow-registry/pull/34) Chore/provide measure data ([@nvdk](https://github.com/nvdk))
- [#33](https://github.com/lblod/app-mow-registry/pull/33) add traffic-measure-concept ([@nvdk](https://github.com/nvdk))
- [#30](https://github.com/lblod/app-mow-registry/pull/30) setup/bump dispatcher, identifier for public sparql access ([@Asergey91](https://github.com/Asergey91))
- [#31](https://github.com/lblod/app-mow-registry/pull/31) add support for linking traffic lights and road markings to road measures. ([@claire-lovisa](https://github.com/claire-lovisa))
- [#28](https://github.com/lblod/app-mow-registry/pull/28) [Auth] Public access to registry ([@claire-lovisa](https://github.com/claire-lovisa))
- [#24](https://github.com/lblod/app-mow-registry/pull/24) Add model to mu-cl-resource configs ([@abeforgit](https://github.com/abeforgit))

#### :bug: Bug Fix

- [#40](https://github.com/lblod/app-mow-registry/pull/40) replace language strings with regular strings ([@nvdk](https://github.com/nvdk))
- [#35](https://github.com/lblod/app-mow-registry/pull/35) solved dispatcher conflicts ([@Asergey91](https://github.com/Asergey91))

#### Committers: 10

- Anita Caron ([@anitacaron](https://github.com/anitacaron))
- Arne Bertrand ([@abeforgit](https://github.com/abeforgit))
- Boris De Vloed ([@bdevloed](https://github.com/bdevloed))
- Niels V ([@nvdk](https://github.com/nvdk))
- Nordine Bittich ([@nbittich](https://github.com/nbittich))
- Oscar Rodriguez Villalobos ([@lagartoverde](https://github.com/lagartoverde))
- Sam Van Campenhout ([@Windvis](https://github.com/Windvis))
- Sergey Andreev ([@Asergey91](https://github.com/Asergey91))
- [@claire-lovisa](https://github.com/claire-lovisa)
- [@gcapurso](https://github.com/gcapurso)
