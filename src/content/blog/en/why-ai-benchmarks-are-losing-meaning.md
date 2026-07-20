---
title: "When 90% is Meaningless: Why AI Benchmarks Are Losing Their Value"
description: "Meituan LongCat just released LoHoSearch, a new search agent benchmark where the best frontier models score a dismal 34%. This exposes a critical flaw in how we evaluate AI today: our tests are saturating faster than the models are actually improving."
date: "2026-07-19"
updatedAt: "2026-07-19"
intent: "industry_analysis"
difficulty: "advanced"
readingTime: 6
---

If you look at the marketing materials for any new Large Language Model, you will be bombarded with bar charts. Model X beats Model Y on MMLU by 2.4%; Model Z achieves a state-of-the-art 92% on HumanEval. 

But talk to any developer actually trying to build reliable AI applications in production, and they will tell you a very different story: **The models that score 90% on paper still fail spectacularly in the real world.**

This week, the AI research community got a stark reminder of this disconnect. Meituan's LongCat team released a new search-agent benchmark called **LoHoSearch**. The results were shocking: across 11 frontier models tested, the absolute best score was a dismal **34.74%**.

Why is this important? Because it exposes a fundamental crisis in AI evaluation: we are running out of good tests.

## The Benchmark Saturation Crisis

To understand why LoHoSearch's low score is actually a good thing, we have to look at what happened to previous benchmarks.

Take `BrowseComp`, a popular benchmark for evaluating web-browsing agents. According to the LongCat team, the average performance of top models on `BrowseComp` went from 30% to over 90% in just 10 months. 

Did AI agents get three times better at browsing the web in less than a year? Absolutely not. Anyone who has tried to use an AI agent to reliably book a flight or scrape a dynamic React website knows that agents are still incredibly brittle. 

What actually happened is **Benchmark Contamination and Overfitting**.
1. **Contamination:** The data from public benchmarks inevitably leaks into the training sets of new models. The models aren't getting smarter; they have just memorized the answers to the test.
2. **Overfitting:** Researchers naturally optimize their models to perform well on the metrics that the industry cares about. It is the AI equivalent of "teaching to the test."

When a benchmark hits 90%, it stops measuring intelligence and starts measuring how well the model has memorized that specific dataset. The benchmark becomes saturated and effectively useless.

## Enter LoHoSearch: A Dose of Reality

Meituan LongCat designed LoHoSearch specifically to combat this saturation. Instead of static questions, it uses a massive knowledge graph based on 7.62 million Wikipedia entities to *automatically generate* complex, multi-hop search questions. 

It tests search agents across 11 different domains, requiring the AI to navigate tree and graph structures of information, synthesize data, and avoid hallucinating connections that don't exist.

Because the questions are generated from a massive, structured knowledge graph rather than a static CSV file, it is incredibly difficult for models to simply memorize the answers during pre-training.

The result? The illusion of 90% competence vanished. The harsh reality of 34.74% emerged.

## Why We Need Harder Tests

A 34% score is not a failure; it is a baseline of truth. 

For the AI industry to transition from building "cool demos" to "enterprise-grade software," we need evaluation metrics that actually correlate with real-world usefulness. 

When a CEO sees that an AI scores 95% on a coding benchmark, they assume it can replace a junior developer. When the AI then repeatedly fails to understand the complex, messy architecture of the company's legacy codebase, trust is destroyed.

The release of LoHoSearch is a much-needed course correction. It reminds the industry that we are still in the very early days of building truly capable, autonomous agents. We don't need models that can ace a standardized test; we need models that can navigate the messy, unstructured reality of the internet. And right now, those models are still failing the midterm.
