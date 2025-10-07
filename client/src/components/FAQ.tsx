import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does overnight investing work?",
    answer: "Every night, your idle cash is automatically invested in overnight money market funds. These are ultra-safe, liquid investments that earn interest overnight and are returned to your account each morning."
  },
  {
    question: "Is my money safe?",
    answer: "Absolutely. Your funds are FDIC insured up to $250,000 and protected with bank-grade encryption. We partner with regulated financial institutions and never have direct access to your money."
  },
  {
    question: "Can I withdraw my money anytime?",
    answer: "Yes! Your funds are available 24/7. You can withdraw any amount at any time without penalties or fees. Funds typically arrive in your bank account within 1-2 business days."
  },
  {
    question: "What's the minimum balance required?",
    answer: "There's no minimum balance for our Starter plan. You can start with as little as $1 and still earn overnight interest. Higher tiers offer better rates and features for larger balances."
  },
  {
    question: "How are taxes handled?",
    answer: "We provide detailed tax reports and integrate with popular tax software. Plus and Premium members get access to tax optimization tools that help minimize your tax burden legally."
  },
  {
    question: "What makes this different from a savings account?",
    answer: "Traditional savings accounts offer minimal interest (often under 0.5% APY). We leverage overnight money market funds to provide significantly higher returns (up to 4.5% APY) while maintaining the same safety and accessibility."
  }
];

export default function FAQ() {
  return (
    <section className="py-24 bg-card">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-foreground mb-6" data-testid="text-faq-title">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground" data-testid="text-faq-subtitle">
            Everything you need to know about overnight investing.
          </p>
        </div>
        
        <Accordion type="single" collapsible className="space-y-4" data-testid="accordion-faq">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border border-border rounded-lg px-6 bg-background">
              <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary py-4" data-testid={`accordion-trigger-${index}`}>
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4" data-testid={`accordion-content-${index}`}>
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
