// IMPORTANT!!!
// Change the IPv4Adress to your computers IPv4
// Mac: https://www.wikihow.com/Find-Your-IP-Address-on-a-Mac
// Windows: https://www.businessinsider.com/guides/tech/how-to-find-ip-address-on-windows?r=US&IR=T
const IPv4Adress = "http://it2810-58.idi.ntnu.no";

const port = "8080";

export async function getMovies(offset: Number, limit: Number, filterWord: string, searchWord: String, orderBy: string) {
    return fetch('http://' + IPv4Adress + ':' + port +'/graphql', { //http://it2810-58.idi.ntnu.no:8080/graphql
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
    },
    body: JSON.stringify({
    query: `
        query GetMovies($offset: Int, $limit: Int, $filterWord: String, $searchWord: String, $orderBy: String) {
        getMovies(offset: $offset, limit: $limit, filterWord: $filterWord, searchWord: $searchWord, orderBy: $orderBy) {
          id
          imdblink
          title
          year
          imdbscore
          genre
          posterlink
        }
      }
      `,
    variables: {
        offset: offset,
        limit: limit,
        filterWord: filterWord,
        searchWord: searchWord,
        orderBy: orderBy,
    },
}),
})
  .then((res) => res.json())
  .then((result) => {return result.data.getMovies})
  .catch((error) => {console.log(error); return null;});
} 
/*  .then((result) => {
    if (typeof result.data.getMovies != "undefined") {
      return result.data.getMovies;
    } else {
      throw TypeError("object is undefined");
    }
  })*/

export async function getMovie(movieId: string) {
    return fetch('http://' + IPv4Adress + ':' + port +'/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
    },
    body: JSON.stringify({
    query: `
        query GetMovie($movieId: String!) {
        getMovie(id: $movieId) {
          id
          imdblink
          title
          year
          imdbscore
          genre
          posterlink
        }
      }
      `,
    variables: {
        movieId: movieId,
    },
}),
})
  .then((res) => res.json())
  .then((result) => {return result.data.getMovie[0]})
  .catch((error) => {console.log(error); return null;});
}

export async function addLike (userId: string, movieId: string) {
    return fetch('http://' + IPv4Adress + ':' + port +'/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
    },
    body: JSON.stringify({
    query: `
        mutation AddLike($movieId: String, $userId: String!) {
            addLike(movieId: $movieId, userId: $userId) {
            favourites
            password
            id
            }
        }
      `,
    variables: {
        movieId: movieId,
        userId: userId,
    },
}),
})
  .then((res) => res.json())
  .then((result) => {return result})
  .catch((error) => {console.log(error); return null;});
}

export async function removeLike (userId: string, movieId: string) {
    return fetch('http://' + IPv4Adress + ':' + port +'/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
    },
    body: JSON.stringify({
    query: `
        mutation RemoveLike($movieId: String, $userId: String!) {
            removeLike(movieId: $movieId, userId: $userId) {
            favourites
            password
            id
            }
        }
      `,
    variables: {
        movieId: movieId,
        userId: userId,
    },
}),
})
  .then((res) => res.json())
  .then((result) => {return result})
  .catch((error) => {console.log(error); return null;});
}

export async function getUser (userId: string) {
    return fetch('http://' + IPv4Adress + ':' + port +'/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
    },
    body: JSON.stringify({
    query: `
        query GetUser($userId: String!) {
            getUser(id: $userId) {
            favourites
            password
            id
            }
        }
      `,
    variables: {
        userId: userId,
    },
}),
})
  .then((res) => res.json())
  .then((result) => {return result.data.getUser})
  .catch((error) => {console.log(error); return null;});

}

export async function addUser (userId: string, password: string) {
    return fetch('http://' + IPv4Adress + ':' + port +'/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
    },
    body: JSON.stringify({
    query: `
        mutation AddUser($userId: String!, $password: String) {
            addUser(id: $userId, password: $password) {
            favourites
            password
            id
            }
        }
      `,
    variables: {
        userId: userId,
        password: password,
    },
}),
})
  .then((res) => res.json())
  .then((result) => {return result})
  .catch((error) => {console.log(error); return null;});
}