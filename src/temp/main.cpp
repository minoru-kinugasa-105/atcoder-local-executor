
#include <iostream>
#include <cstdio>
#include <cstdlib>
#include <cmath>
#include <algorithm>
#include <vector>
#include <map>
#include <set>
#include <queue>
#include <stack>
#include <string>
#include <cstring>
#include <cassert>
#include <climits>
#include <cctype>
#include <ctime>
#include <numeric>
#include <functional>
#include <bitset>
#include <unordered_map>
#include <unordered_set>
using namespace std;
using ll = long long;

int main() {
	int N;
	string T,A;
    cin >> N;
    cin >> T;
    cin >> A;
    
    for (int i = 0; i < N; i++) {
        if (T[i] == 'o' && A[i] == 'o') {
            cout << "Yes" << endl;
            return 0;
        }
    }

    cout << "No" << endl;

    return 0;
}
