// void depthFirstSearch(int currentNode, bool indexVisited[], vector < int > adj[]) {
//     if (indexVisited[currentNode]) {
//         return;
//     }
//     cout << currentNode;
//     indexVisited[currentNode] = true;
//     int n = adj[currentNode].size();
//     for (int i = 0; i < n; ++i) {
//         depthFirstSearch(adj[currentNode][i], indexVisited, adj);
//     }
//     return;
// }

// void depthFirstSearchIterative(int currentNode, bool indexVisited[], vector < int > adj[]) {
//     // pop order should be followed
//     stack < int > s;
//     int topNode;
//     s.push(currentNode);
//     indexVisited[currentNode] = true;
//     cout << currentNode;
//     while (!s.emtpty()) {
//         topNode = s.top();
//         s.pop();
//         int n = adj[topNode].size();
//         for (int i = 0; i < n; ++i) {
//             if (!indexVisited[adj[topNode][i]]) {
//                 s.push(adj[topNode][i]);
//                 indexVisited[adj[topNode][i]] = true;
//                 cout << adj[topNode][i];
//             }
//         }
//     }
// }

// void breadthfirstsearch(int currentNode, bool indexVisited[], vector < int > adj[]) {
//     // push or pop, any order can be followed
//     queue < int > q;
//     int frontNode;
//     q.push(currentNode);
//     indexVisited[currentNode] = true;
//     cout << currentNode;
//     while (!q.empty()) {
//         frontNode = q.front();
//         q.pop();
//         int n = adj[frontNode].size();
//         for (int i = 0; i < n; ++i) {
//             if (!indexVisited[adj[frontNode][i]]) {
//                 q.push(adj[frontNode][i]);
//                 indexVisited[adj[frontNode][i]] = true;
//                 cout << adj[frontNode][i];
//                 break;
//             }
//         }
//     }
// }

// int main() {
//     int n, e, firstNode, secondNode;

//     cin >> n >> e;
//     bool indexVisited[n + 1];
//     for (int i = 0; i < n; ++i) {
//         indexVisited[i] = false;
//     }
//     vector < int > adj[n + 1];
//     for (int i = 0; i < e; ++i) {
//         cin >> firstNode >> secondNode;
//         adj[firstNode].push(secondNode);
//         adj[secondNode].push(firstNode);
//     }

//     for (int i = 0; i < n; ++i) {
//         if (indexVisited[i] == false) {
//             depthFirstSearch(i, indexVisited);
//         }
//     }
//     return 0;

//     nCr = n - 1Cr- 1 + n - 1Cr
//     dp[n][r] = dp[n - 1][r - 1] + dp[n - 1][r];
//     dp[1][1] = 1;
//     as i: 0 to n
//     as j: 0 to r
// }

