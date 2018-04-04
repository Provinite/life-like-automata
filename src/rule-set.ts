export interface RuleSet<T, K> {
    evaluate(state : T) : K;
}
