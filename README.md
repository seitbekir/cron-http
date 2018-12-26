# cron-http

This is scheduled tasks manager that calls `method uri` with Cron expression syntax.
Orientaited to keep in Docker. Access via REST API.

If you need more advanced features and scheduled queues, use [kue-schedule](https://github.com/lykmapipo/kue-scheduler) or something kind of.

## API

The API access to Store

* Application port is `8293`
* Validation was done with [week-validator](https://github.com/seitbekir/week-validator)

### Task Model

```ts
interface Task {
    id: String | UUID; // autogenerates UUID
    title: String;
    expression: String;
    method: 'GET'|'POST'|'PUT'|'PATCH'|'DELETE'|'OPTIONS';
    uri: URL;
    suicide: Boolean;
    executed: Integer;
    disabled: Boolean;
    timezone: TimeZone;
}
```

### Create Task

Create task on server

#### Specs

POST: `/`

| field | required | description | default |
| -- |:-:|-|:-:|
| title | yes | title of the task | |
| expression | yes | Cron-style time expression | |
| method | | HTTP Request Method | GET |
| uri | yes | HTTP Request uri/url |
| suicide | | Remove the task after been executed | false |
| disabled | | Disable task executing on server | false |
| timezone | | Set timezone (IANA Time Zones) of expression for been executed | UTC |

#### Example

```curl
curl -X POST \
    http://localhost:8293/ \
    -H 'Content-Type: application/json' \
    -d '{
        "title": "testing Task",
        "expression": "* * * * *",
        "method": "POST",
        "uri": "http://docker.host:3000/test"
    }'
```

Returns: `201 Created` body: `Task`

### Create Task (with preset Id)

#### Specs

POST: `/:taskId`

| field | required | description | default |
| -- |:-:|-|:-:|
| title | yes | title of the task | |
| expression | yes | Cron-style time expression | |
| method | | HTTP Request Method | GET |
| uri | yes | HTTP Request uri/url |
| suicide | | Remove the task after been executed | false |
| disabled | | Disable task executing on server | false |
| timezone | | Set timezone (IANA Time Zones) of expression for been executed | UTC |

#### Example

```curl
curl -X POST \
    http://localhost:8293/any-string-id-available \
    -H 'Content-Type: application/json' \
    -d '{
        "title": "testing Task",
        "expression": "* * * * *",
        "method": "POST",
        "uri": "http://docker.host:3000/test"
    }'
```

Returns: `201 Created` body: `Task`

### Update Task

Updates any allowed field of Task

PATCH: `/:taskId`

| field | required | description | default |
| -- |:-:|-|:-:|
| title | | title of the task | Actual |
| expression | | Cron-style time expression | Actual |
| method | | HTTP Request Method | Actual |
| uri | | HTTP Request uri/url | Actual |
| suicide | | Remove the task after been executed | Actual |
| disabled | | Disable task executing on server | Actual |
| timezone | | Set timezone (IANA Time Zones) of expression for been executed | Actual |

#### Example

```curl
curl -X PATCH \
    http://localhost:8293/any-string-id-available \
    -H 'Content-Type: application/json' \
    -d '{
        "title": "Better Title",
        "method": "PUT",
    }'
```

Returns: `202 Updated` body: `Task` with updated `Task.title` and `Task.method`

### Get Task

Returning task by Id

GET: `/:taskId`

#### Example

```curl
curl -X GET \
  http://localhost:8293/any-string-id-available
```

Returns: `200 Ok` body: `Task`

### Get Tasks (all)

Returning All tasks in array

GET: `/`

#### Example

```curl
curl -X GET \
  http://localhost:8293/
```

Returns:
* `200 Ok` body: `Task[]`
* `204 No Content` body: `[]`

### Delete Task

Remove Task by Id

DELETE: `/:taskId`

```curl
curl -X DELETE \
  http://localhost:8293/any-string-id-available
```

Returns: `200 Ok` body: `Task`

## Use in Docker

To Build use:

```sh
git clone https://github.com/seitbekir/cron-http ./cron-http
cd cron-http
docker build -t cron-http .
```

To Run use:

```sh
    docker run \
    -d \
    --restart always \
    --name my-app.cron-http \
    --network=my-app-network \ # Better to use in network
    --publish 8293:8293 \ # Only for debugging!
    cron-http
```

## Contribution

Feel free to create issues, PRs. Let's make this world (and this application) better!